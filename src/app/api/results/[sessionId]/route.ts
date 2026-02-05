import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

  // Get the latest submission for this session
  const { data: submission, error: subError } = await supabase
    .from("submissions")
    .select("id, total_co2_kg, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (subError || !submission) {
    return NextResponse.json(
      { error: "No results found for this session" },
      { status: 404 }
    );
  }

  // Get category breakdowns
  const { data: categories, error: catError } = await supabase
    .from("submission_categories")
    .select("category, co2_kg")
    .eq("submission_id", submission.id);

  if (catError) {
    return NextResponse.json(
      { error: "Failed to load category data" },
      { status: 500 }
    );
  }

  const categoryMap: Record<string, number> = {};
  for (const row of categories || []) {
    categoryMap[row.category] = Number(row.co2_kg);
  }

  return NextResponse.json({
    total: Number(submission.total_co2_kg),
    categories: categoryMap,
    createdAt: submission.created_at,
  });
}
