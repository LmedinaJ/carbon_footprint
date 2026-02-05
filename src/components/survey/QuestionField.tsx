"use client";

import { Question } from "@/lib/types";

interface QuestionFieldProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function QuestionField({
  question,
  value,
  onChange,
}: QuestionFieldProps) {
  const inputClass =
    "w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow";

  if (question.type === "number") {
    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {question.text}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "0"}
            min={question.min ?? 0}
            max={question.max}
          />
          {question.unit && (
            <span className="text-xs text-gray-400 whitespace-nowrap min-w-fit">
              {question.unit}
            </span>
          )}
        </div>
        {question.helpText && (
          <p className="mt-1 text-xs text-gray-400">{question.helpText}</p>
        )}
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {question.text}
        </label>
        <select
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select an option...</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {question.helpText && (
          <p className="mt-1 text-xs text-gray-400">{question.helpText}</p>
        )}
      </div>
    );
  }

  if (question.type === "radio") {
    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {question.text}
        </label>
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-3 py-2.5 border rounded-md cursor-pointer transition-colors text-sm ${
                value === opt.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {question.helpText && (
          <p className="mt-1 text-xs text-gray-400">{question.helpText}</p>
        )}
      </div>
    );
  }

  return null;
}
