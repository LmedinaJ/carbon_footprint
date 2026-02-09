"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ComparisonChartProps {
  userCategories: Record<string, number>;
  allUsersAvg: Record<string, number>;
}

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
  waste: "Waste",
};

export function ComparisonChart({
  userCategories,
  allUsersAvg,
}: ComparisonChartProps) {
  const categories = Object.keys(userCategories);
  const data = categories.map((cat) => ({
    name: CATEGORY_LABELS[cat] || cat,
    You: userCategories[cat] || 0,
    "All Users Avg": allUsersAvg[cat] || 0,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
            formatter={(value) => [
              `${Number(value).toLocaleString()} kg CO2e/year`,
            ]}
          />
          <Legend />
          <Bar dataKey="You" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="All Users Avg" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
