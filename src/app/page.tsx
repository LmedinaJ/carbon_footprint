import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {/* Hero section with gradient */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-10 mb-8 border border-emerald-100">
        <div className="text-5xl mb-4">🌍</div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Carbon Footprint Calculator
        </h1>
        <p className="text-gray-600 mb-3 leading-relaxed">
          Estimate your annual CO2e emissions based on your habits in
          transportation, energy, food, and waste.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Compare your results with global and regional averages.
        </p>
        <Link href="/survey">
          <Button>Start the Survey</Button>
        </Link>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🚗</div>
          <p className="text-xs font-medium text-blue-700">Transportation</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-xs font-medium text-amber-700">Home Energy</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🍽️</div>
          <p className="text-xs font-medium text-green-700">Food & Diet</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">♻️</div>
          <p className="text-xs font-medium text-slate-700">Waste</p>
        </div>
      </div>
    </div>
  );
}
