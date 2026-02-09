"use client";

import { StudentInfo } from "@/lib/types";

interface StudentInfoStepProps {
  studentInfo: StudentInfo;
  onChange: (field: keyof StudentInfo, value: string) => void;
}

export function StudentInfoStep({ studentInfo, onChange }: StudentInfoStepProps) {
  return (
    <div>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold text-purple-700">
          👤 Your Information
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please provide your details to get started
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="student_name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="student_name"
            value={studentInfo.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="student_email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="student_email"
            value={studentInfo.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            We&apos;ll use this to identify your submission
          </p>
        </div>
      </div>
    </div>
  );
}
