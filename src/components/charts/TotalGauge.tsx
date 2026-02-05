"use client";

interface TotalGaugeProps {
  total: number;
}

function getLevel(total: number): { label: string; color: string } {
  if (total < 2000) return { label: "Very Low", color: "text-emerald-600" };
  if (total < 4000) return { label: "Low", color: "text-green-600" };
  if (total < 6000) return { label: "Moderate", color: "text-yellow-600" };
  if (total < 10000) return { label: "High", color: "text-orange-600" };
  return { label: "Very High", color: "text-red-600" };
}

export function TotalGauge({ total }: TotalGaugeProps) {
  const level = getLevel(total);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Your Annual Carbon Footprint
      </p>
      <p className={`text-5xl font-bold tracking-tight ${level.color} mb-1`}>
        {total.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400 mb-5">kg CO2 per year</p>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${level.color} bg-gray-50 border border-gray-200`}
      >
        {level.label}
      </span>
    </div>
  );
}
