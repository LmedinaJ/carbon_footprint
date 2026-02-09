import { surveyCategories } from "@/config/survey-questions";
import { SurveyAnswers, StudentInfo } from "@/lib/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Build a lookup of valid options per question from config
const questionMeta = new Map<
  string,
  { type: string; options?: string[]; min?: number; max?: number }
>();

for (const category of surveyCategories) {
  for (const question of category.questions) {
    questionMeta.set(question.id, {
      type: question.type,
      options: question.options?.map((o) => o.value),
      min: question.min ?? 0,
      max: question.max ?? 100000,
    });
  }
}

export function validateSessionId(sessionId: unknown): string | null {
  if (typeof sessionId !== "string" || !UUID_REGEX.test(sessionId)) {
    return "Invalid session ID format";
  }
  return null;
}

export function validateStudentInfo(studentInfo: unknown): string | null {
  if (!studentInfo || typeof studentInfo !== "object" || Array.isArray(studentInfo)) {
    return "Student info must be an object";
  }

  const info = studentInfo as StudentInfo;

  if (typeof info.name !== "string" || !info.name.trim()) {
    return "Student name is required";
  }

  if (info.name.length > 200) {
    return "Student name is too long";
  }

  if (typeof info.email !== "string" || !info.email.trim()) {
    return "Student email is required";
  }

  if (!EMAIL_REGEX.test(info.email)) {
    return "Invalid email format";
  }

  if (info.email.length > 320) {
    return "Email is too long";
  }

  return null;
}

export function validateAnswers(answers: unknown): string | null {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return "Answers must be an object";
  }

  const ans = answers as SurveyAnswers;

  for (const [questionId, value] of Object.entries(ans)) {
    const meta = questionMeta.get(questionId);
    if (!meta) {
      return `Unknown question: ${questionId}`;
    }

    if (typeof value !== "string") {
      return `Answer for ${questionId} must be a string`;
    }

    if (meta.type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return `Answer for ${questionId} must be a number`;
      }
      if (num < (meta.min ?? 0) || num > (meta.max ?? 100000)) {
        return `Answer for ${questionId} is out of range (${meta.min}-${meta.max})`;
      }
    }

    if ((meta.type === "select" || meta.type === "radio") && meta.options) {
      if (!meta.options.includes(value)) {
        return `Invalid option for ${questionId}: ${value}`;
      }
    }
  }

  return null;
}

export const MAX_SUBMISSIONS_PER_SESSION = 10;
