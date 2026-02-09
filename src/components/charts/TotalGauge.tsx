"use client";

interface TotalGaugeProps {
  total: number;
}

interface Level {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function getLevel(total: number): Level {
  if (total < 2000) return {
    label: "Very Low",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  };
  if (total < 4000) return {
    label: "Low",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  };
  if (total < 6000) return {
    label: "Moderate",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  };
  if (total < 10000) return {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  };
  return {
    label: "Very High",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  };
}

const LEVELS = [
  { max: 2000, label: "Very Low", color: "bg-emerald-500" },
  { max: 4000, label: "Low", color: "bg-green-500" },
  { max: 6000, label: "Moderate", color: "bg-yellow-500" },
  { max: 10000, label: "High", color: "bg-orange-500" },
  { max: Infinity, label: "Very High", color: "bg-red-500" },
];

export function TotalGauge({ total }: TotalGaugeProps) {
  const level = getLevel(total);

  // Calculate position on the scale (0-100%)
  const maxScale = 12000;
  const position = Math.min((total / maxScale) * 100, 100);

  return (
    <div className={`${level.bgColor} border ${level.borderColor} rounded-xl p-8 text-center`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Your Annual Carbon Footprint
      </p>
      <p className={`text-5xl font-bold tracking-tight ${level.color} mb-1`}>
        {total.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-4">kg CO2e per year</p>

      {/* Color scale bar */}
      <div className="relative mb-4">
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="flex-1 bg-emerald-500"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-red-500"></div>
        </div>
        {/* Position indicator */}
        <div
          className="absolute top-0 w-1 h-3 bg-gray-900 rounded"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>0</span>
        <span>2k</span>
        <span>4k</span>
        <span>6k</span>
        <span>10k+</span>
      </div>

      <span
        className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${level.color} ${level.bgColor} border ${level.borderColor}`}
      >
        {level.label}
      </span>
    </div>
  );
}
