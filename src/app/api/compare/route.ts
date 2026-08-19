import { NextRequest, NextResponse } from "next/server";
import { getSubmissionsSheet, CATEGORY_IDS } from "@/lib/sheets";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateSessionId } from "@/lib/validation";
import referenceData from "@/data/reference-averages.json";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  const sessionError = validateSessionId(sessionId);
  if (sessionError) {
    return NextResponse.json({ error: sessionError }, { status: 400 });
  }

  let rows;
  try {
    const sheet = await getSubmissionsSheet();
    rows = await sheet.getRows();
  } catch (err) {
    console.error("Failed to load Google Sheet", err);
    return NextResponse.json(
      { error: "Failed to load comparison data" },
      { status: 500 }
    );
  }

  const sessionRows = rows.filter((row) => row.get("session_id") === sessionId);
  if (sessionRows.length === 0) {
    return NextResponse.json(
      { error: "No results found" },
      { status: 404 }
    );
  }

  // User's latest submission
  const latest = sessionRows.reduce((a, b) =>
    new Date(a.get("created_at")) > new Date(b.get("created_at")) ? a : b
  );

  const userMap: Record<string, number> = {};
  for (const categoryId of CATEGORY_IDS) {
    userMap[categoryId] = Number(latest.get(`category_${categoryId}_kg`)) || 0;
  }
  const userTotal = Number(latest.get("total_co2_kg")) || 0;

  // Average per category across ALL submissions (matches previous behavior,
  // which averaged over every row rather than deduping per session)
  const sums: Record<string, number> = {};
  for (const categoryId of CATEGORY_IDS) sums[categoryId] = 0;

  for (const row of rows) {
    for (const categoryId of CATEGORY_IDS) {
      sums[categoryId] += Number(row.get(`category_${categoryId}_kg`)) || 0;
    }
  }

  const allUsersAvg: Record<string, number> = {};
  let allUsersAvgTotal = 0;
  for (const categoryId of CATEGORY_IDS) {
    const avg = rows.length > 0 ? Math.round(sums[categoryId] / rows.length) : 0;
    allUsersAvg[categoryId] = avg;
    allUsersAvgTotal += avg;
  }

  return NextResponse.json({
    user: userMap,
    userTotal,
    allUsersAvg,
    allUsersAvgTotal,
    referenceAverages: {
      world: referenceData.world_average,
      continents: referenceData.continents,
      countries: referenceData.countries,
    },
  });
}
