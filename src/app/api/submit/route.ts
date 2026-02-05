import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateFootprint } from "@/lib/calculator";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  validateSessionId,
  validateAnswers,
  MAX_SUBMISSIONS_PER_SESSION,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { sessionId, answers } = body as {
    sessionId: unknown;
    answers: unknown;
  };

  // Validate session ID
  const sessionError = validateSessionId(sessionId);
  if (sessionError) {
    return NextResponse.json({ error: sessionError }, { status: 400 });
  }

  // Validate answers
  const answersError = validateAnswers(answers);
  if (answersError) {
    return NextResponse.json({ error: answersError }, { status: 400 });
  }

  // Check insert limit per session
  const { count } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId as string);

  if (count !== null && count >= MAX_SUBMISSIONS_PER_SESSION) {
    return NextResponse.json(
      {
        error: `Maximum submissions (${MAX_SUBMISSIONS_PER_SESSION}) reached for this session.`,
      },
      { status: 429 }
    );
  }

  // Calculate footprint
  const result = calculateFootprint(answers as Record<string, string>);

  // Insert submission
  const { data: submission, error: subError } = await supabase
    .from("submissions")
    .insert({
      session_id: sessionId as string,
      total_co2_kg: result.total,
    })
    .select("id")
    .single();

  if (subError || !submission) {
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  // Insert category breakdowns
  const categoryRows = Object.entries(result.categories).map(
    ([category, co2_kg]) => ({
      submission_id: submission.id,
      category,
      co2_kg,
    })
  );

  const { error: catError } = await supabase
    .from("submission_categories")
    .insert(categoryRows);

  if (catError) {
    return NextResponse.json(
      { error: "Failed to save category data" },
      { status: 500 }
    );
  }

  // Insert raw answers
  const answerRows = Object.entries(answers as Record<string, string>).map(
    ([question_id, answer_value]) => ({
      submission_id: submission.id,
      question_id,
      answer_value,
    })
  );

  const { error: ansError } = await supabase
    .from("submission_answers")
    .insert(answerRows);

  if (ansError) {
    return NextResponse.json(
      { error: "Failed to save answer data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, sessionId });
}
