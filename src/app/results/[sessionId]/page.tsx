"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { TotalGauge } from "@/components/charts/TotalGauge";

interface ResultsData {
  total: number;
  categories: Record<string, number>;
}

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [data, setData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/results/${sessionId}`);
        if (!res.ok) {
          const body = await res.json();
          setError(body.error || "Failed to load results");
          return;
        }
        const result = await res.json();
        setData(result);
      } catch {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
          <div className="h-40 bg-gray-100 rounded" />
          <div className="h-64 bg-gray-100 rounded" />
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

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
        Your Results
      </h1>

      <TotalGauge total={data.total} />

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Breakdown by Category
        </h2>
        <CategoryBarChart categories={data.categories} />
      </Card>

      <div className="mt-8 flex gap-3 justify-center">
        <Link href={`/compare/${sessionId}`}>
          <Button>Compare with Others</Button>
        </Link>
        <Link href="/survey">
          <Button variant="outline">Retake Survey</Button>
        </Link>
      </div>
    </div>
  );
}
