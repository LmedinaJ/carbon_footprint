"use client";

import { Category, SurveyAnswers } from "@/lib/types";
import { QuestionField } from "./QuestionField";

interface CategoryStepProps {
  category: Category;
  answers: SurveyAnswers;
  onAnswer: (questionId: string, value: string) => void;
}

export function CategoryStep({
  category,
  answers,
  onAnswer,
}: CategoryStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {category.icon} {category.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1">{category.description}</p>
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
