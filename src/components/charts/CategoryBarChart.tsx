"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#3b82f6",
  energy: "#f59e0b",
  food: "#22c55e",
  waste: "#6b7280",
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
  waste: "Waste",
};

interface CategoryBarChartProps {
  categories: Record<string, number>;
}

export function CategoryBarChart({ categories }: CategoryBarChartProps) {
  const data = Object.entries(categories).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    co2: value,
    color: CATEGORY_COLORS[key] || "#9ca3af",
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "kg CO2e/year",
              angle: -90,
              position: "insideLeft",
              offset: -5,
            }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} kg CO2e/year`]}
          />
          <Bar dataKey="co2" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
