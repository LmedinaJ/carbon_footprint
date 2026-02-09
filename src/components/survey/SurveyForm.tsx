"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { surveyCategories } from "@/config/survey-questions";
import { SurveyAnswers, StudentInfo } from "@/lib/types";
import { useSessionId } from "@/hooks/useSessionId";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CategoryStep } from "./CategoryStep";
import { StudentInfoStep } from "./StudentInfoStep";

export function SurveyForm() {
  const router = useRouter();
  const sessionId = useSessionId();
  const [currentStep, setCurrentStep] = useState(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: "", email: "" });
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 0 = Student Info, Steps 1-4 = Categories
  const totalSteps = surveyCategories.length + 1;
  const isStudentInfoStep = currentStep === 0;
  const currentCategory = isStudentInfoStep ? null : surveyCategories[currentStep - 1];

  const stepLabels = ["Your Info", ...surveyCategories.map((c) => c.title)];

  function handleStudentInfoChange(field: keyof StudentInfo, value: string) {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
  }

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function validateStudentInfo(): boolean {
    if (!studentInfo.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!studentInfo.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  }

  function handlePrevious() {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setError(null);
  }

  function handleNext() {
    if (isStudentInfoStep && !validateStudentInfo()) {
      return;
    }
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
    setError(null);
  }

  async function handleSubmit() {
    if (!sessionId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, studentInfo, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/results/${sessionId}`);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar
        current={currentStep}
        total={totalSteps}
        labels={stepLabels}
      />

      <Card>
        {isStudentInfoStep ? (
          <StudentInfoStep
            studentInfo={studentInfo}
            onChange={handleStudentInfoChange}
          />
        ) : (
          currentCategory && (
            <CategoryStep
              category={currentCategory}
              answers={answers}
              onAnswer={handleAnswer}
            />
          )
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Calculating..." : "Calculate My Footprint"}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
