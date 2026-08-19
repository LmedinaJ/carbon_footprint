import { NextRequest, NextResponse } from "next/server";
import { getSubmissionsSheet, CATEGORY_IDS } from "@/lib/sheets";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateSessionId } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const { sessionId } = await params;
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
      { error: "Failed to load results" },
      { status: 500 }
    );
  }

  const sessionRows = rows.filter((row) => row.get("session_id") === sessionId);
  if (sessionRows.length === 0) {
    return NextResponse.json(
      { error: "No results found for this session" },
      { status: 404 }
    );
  }

  // Latest submission for this session
  const latest = sessionRows.reduce((a, b) =>
    new Date(a.get("created_at")) > new Date(b.get("created_at")) ? a : b
  );

  const categoryMap: Record<string, number> = {};
  for (const categoryId of CATEGORY_IDS) {
    categoryMap[categoryId] = Number(latest.get(`category_${categoryId}_kg`)) || 0;
  }

  return NextResponse.json({
    total: Number(latest.get("total_co2_kg")) || 0,
    categories: categoryMap,
    createdAt: latest.get("created_at"),
  });
}
