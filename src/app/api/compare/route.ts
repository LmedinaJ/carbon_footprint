import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

  // Get user's latest submission
  const { data: submission } = await supabase
    .from("submissions")
    .select("id, total_co2_kg")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!submission) {
    return NextResponse.json(
      { error: "No results found" },
      { status: 404 }
    );
  }

  // Get user's category breakdown
  const { data: userCategories } = await supabase
    .from("submission_categories")
    .select("category, co2_kg")
    .eq("submission_id", submission.id);

  const userMap: Record<string, number> = {};
  for (const row of userCategories || []) {
    userMap[row.category] = Number(row.co2_kg);
  }

  // Get average per category across ALL users
  const { data: allCategories } = await supabase
    .from("submission_categories")
    .select("category, co2_kg");

  const avgMap: Record<string, { sum: number; count: number }> = {};
  for (const row of allCategories || []) {
    if (!avgMap[row.category]) {
      avgMap[row.category] = { sum: 0, count: 0 };
    }
    avgMap[row.category].sum += Number(row.co2_kg);
    avgMap[row.category].count++;
  }

  const allUsersAvg: Record<string, number> = {};
  let allUsersAvgTotal = 0;
  for (const [cat, data] of Object.entries(avgMap)) {
    const avg = Math.round(data.sum / data.count);
    allUsersAvg[cat] = avg;
    allUsersAvgTotal += avg;
  }

  return NextResponse.json({
    user: userMap,
    userTotal: Number(submission.total_co2_kg),
    allUsersAvg,
    allUsersAvgTotal,
    referenceAverages: {
      world: referenceData.world_average,
      continents: referenceData.continents,
      countries: referenceData.countries,
    },
  });
}
