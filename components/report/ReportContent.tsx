"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

interface ReportData {
  routineId: string;
  theme: string;
  summary: string;
  scoreChange: number;
  week: number;
  createdAt: string;
}

export default function ReportContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup?callbackUrl=/report");
      return;
    }

    if (status === "authenticated" && session?.user) {
      fetch("/api/reports/latest")
        .then((res) => res.json())
        .then((data) => {
          setReportData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("리포트 데이터 가져오기 실패:", error);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            AI GENERATED REPORT
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl">
            Weekly Progress Report
          </h1>
        </div>

        {reportData ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">
                  {reportData.theme} Routine · Week {reportData.week}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(reportData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Score Change
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      reportData.scoreChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {reportData.scoreChange >= 0 ? "+" : ""}
                    {reportData.scoreChange.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      reportData.scoreChange >= 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(reportData.scoreChange), 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  AI Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {reportData.summary}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/learning-room"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                ← Back to Learning Room
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                Start Next Routine →
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
            <p className="text-sm text-gray-600">
              No report available yet. Complete your first week to see your AI-generated progress report.
            </p>
            <Link
              href="/learning-room"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              Go to Learning Room →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

