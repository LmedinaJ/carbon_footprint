import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { surveyCategories } from "@/config/survey-questions";

const SHEET_TITLE = "Submissions";

const sheetId = process.env.GOOGLE_SHEET_ID || "";
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
// Private keys are stored in env as a single line with literal "\n" escapes.
const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!sheetId || !serviceAccountEmail || !privateKey) {
  console.warn(
    "Google Sheets environment variables are not set. Database operations will fail."
  );
}

const auth = new JWT({
  email: serviceAccountEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(sheetId || "placeholder", auth);

// Column layout is derived from the survey config so it stays in sync
// automatically if categories/questions are added or renamed.
export const CATEGORY_IDS = surveyCategories.map((c) => c.id);
export const QUESTION_IDS = surveyCategories.flatMap((c) =>
  c.questions.map((q) => q.id)
);

export const HEADER_ROW = [
  "session_id",
  "student_name",
  "student_email",
  "total_co2_kg",
  "created_at",
  ...CATEGORY_IDS.map((id) => `category_${id}_kg`),
  ...QUESTION_IDS.map((id) => `q_${id}`),
];

let infoLoaded = false;

/**
 * Returns the "Submissions" worksheet, creating it (with the correct header)
 * on first use if it doesn't exist yet.
 */
export async function getSubmissionsSheet(): Promise<GoogleSpreadsheetWorksheet> {
  if (!infoLoaded) {
    await doc.loadInfo();
    infoLoaded = true;
  }

  let sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    sheet = await doc.addSheet({ title: SHEET_TITLE, headerValues: HEADER_ROW });
  }

  return sheet;
}
