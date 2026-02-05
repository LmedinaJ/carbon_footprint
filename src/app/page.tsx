import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto text-center py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
        Carbon Footprint Calculator
      </h1>
      <p className="text-gray-500 mb-3 leading-relaxed">
        Estimate your annual CO2 emissions based on your habits in
        transportation, energy, food, and waste.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        Compare your results with global and regional averages.
      </p>
      <Link href="/survey">
        <Button>Start the Survey</Button>
      </Link>
    </div>
  );
}
