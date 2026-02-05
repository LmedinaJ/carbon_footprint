"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  labels?: string[];
}

export function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Step {current + 1} of {total}
        </span>
        {labels && labels[current] && (
          <span className="text-xs font-medium text-gray-900">
            {labels[current]}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-gray-900 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
