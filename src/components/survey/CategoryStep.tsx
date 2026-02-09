"use client";

import { Category, SurveyAnswers } from "@/lib/types";
import { QuestionField } from "./QuestionField";

interface CategoryStepProps {
  category: Category;
  answers: SurveyAnswers;
  onAnswer: (questionId: string, value: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  transport: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  energy: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  food: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  waste: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
};

export function CategoryStep({
  category,
  answers,
  onAnswer,
}: CategoryStepProps) {
  const colors = CATEGORY_COLORS[category.id] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };

  return (
    <div>
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 mb-6`}>
        <h2 className={`text-lg font-semibold ${colors.text}`}>
          {category.icon} {category.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
      </div>

      <div className="space-y-1">
        {category.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onChange={(value) => onAnswer(question.id, value)}
          />
        ))}
      </div>
    </div>
  );
}
