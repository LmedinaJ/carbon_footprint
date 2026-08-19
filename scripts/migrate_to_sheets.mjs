/**
 * Migrate carbon footprint data into the new Google Sheets backend.
 *
 * Usage:
 *   1. python export_to_csv.py         (pulls existing data out of Supabase)
 *   2. node migrate_to_sheets.mjs      (pushes exports/carbon_footprint_export.csv into the sheet)
 *
 * Reads GOOGLE_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY from .env.local
 * (same file the Next.js app uses). Creates the "Submissions" tab if it doesn't exist yet,
 * using the CSV header as-is so it always matches whatever export_to_csv.py produced.
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const env = {};
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

// Minimal RFC 4180 CSV parser (handles quoted fields containing commas/newlines).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

async function main() {
  const csvPath = path.join(__dirname, "exports", "carbon_footprint_export.csv");
  if (!existsSync(csvPath)) {
    throw new Error(
      `No export found at ${csvPath}. Run export_to_csv.py first.`
    );
  }

  const rows = parseCsv(readFileSync(csvPath, "utf-8"));
  if (rows.length < 2) {
    console.log("Export is empty. Nothing to migrate.");
    return;
  }
  const [header, ...dataRows] = rows;

  const env = loadEnvLocal();
  const sheetId = env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    throw new Error(
      "Missing GOOGLE_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY in .env.local"
    );
  }

  console.log(`Connecting to spreadsheet ${sheetId}...`);
  const auth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle["Submissions"];
  if (!sheet) {
    console.log('Creating "Submissions" sheet...');
    sheet = await doc.addSheet({ title: "Submissions", headerValues: header });
  } else {
    await sheet.setHeaderRow(header);
  }

  const records = dataRows.map((row) =>
    Object.fromEntries(header.map((col, i) => [col, row[i] ?? ""]))
  );

  console.log(`Uploading ${records.length} rows...`);
  await sheet.addRows(records);

  console.log("Migration complete.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
