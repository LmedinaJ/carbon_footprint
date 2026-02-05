"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { ComparisonData } from "@/lib/types";

export default function ComparePage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [data, setData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedContinent, setSelectedContinent] = useState<string>("");

  useEffect(() => {
    async function fetchComparison() {
      try {
        const res = await fetch(`/api/compare?sessionId=${sessionId}`);
        if (!res.ok) {
          const body = await res.json();
          setError(body.error || "Failed to load comparison data");
          return;
        }
        const result = await res.json();
        setData(result);
      } catch {
        setError("Failed to load comparison data");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) fetchComparison();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
          <div className="h-64 bg-gray-100 rounded" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Card>
          <p className="text-sm text-red-600 mb-4">
            {error || "No data found"}
          </p>
          <Link href="/survey">
            <Button>Take the Survey</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const countries = Object.keys(data.referenceAverages.countries);
  const continents = Object.keys(data.referenceAverages.continents);

  const selectedCountryData = selectedCountry
    ? (
        data.referenceAverages.countries as Record<
          string,
          { co2_per_capita: number; continent: string }
        >
      )[selectedCountry]
    : null;

  const selectedContinentAvg = selectedContinent
    ? (data.referenceAverages.continents as Record<string, number>)[
        selectedContinent
      ]
    : null;

  const selectClass =
    "w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
        Compare Your Footprint
      </h1>

      <Card className="mb-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          You vs. All Users (by Category)
        </h2>
        <ComparisonChart
          userCategories={data.user}
          allUsersAvg={data.allUsersAvg}
        />
      </Card>

      <Card className="mb-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
          Total Footprint
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-xs text-gray-400 mb-1">You</p>
            <p className="text-xl font-bold text-gray-900">
              {data.userTotal.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-1">
                kg
              </span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-xs text-gray-400 mb-1">All Users Avg</p>
            <p className="text-xl font-bold text-gray-900">
              {data.allUsersAvgTotal.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-1">
                kg
              </span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-xs text-gray-400 mb-1">World Avg</p>
            <p className="text-xl font-bold text-gray-900">
              {data.referenceAverages.world.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-1">
                kg
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Compare with a country
            </label>
            <select
              className={selectClass}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select a country...</option>
              {countries.sort().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {selectedCountryData && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-center">
                <p className="text-xs text-gray-400">{selectedCountry}</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedCountryData.co2_per_capita.toLocaleString()} kg
                </p>
                <p className="text-xs text-gray-400">
                  {selectedCountryData.continent}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Compare with a continent
            </label>
            <select
              className={selectClass}
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
            >
              <option value="">Select a continent...</option>
              {continents.sort().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {selectedContinentAvg !== null &&
              selectedContinentAvg !== undefined && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-center">
                  <p className="text-xs text-gray-400">{selectedContinent}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedContinentAvg.toLocaleString()} kg
                  </p>
                </div>
              )}
          </div>
        </div>

        <div className="mt-4 p-3 border border-gray-200 rounded-md text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Note:</strong> Your calculated
          footprint covers personal transport, household energy, food, and
          waste. National averages include all emission sources (industry,
          infrastructure, etc.). Your actual total footprint may be higher.
        </div>
      </Card>

      <div className="flex gap-3 justify-center">
        <Link href={`/results/${sessionId}`}>
          <Button variant="outline">Back to Results</Button>
        </Link>
        <Link href="/survey">
          <Button variant="outline">Retake Survey</Button>
        </Link>
      </div>
    </div>
  );
}
