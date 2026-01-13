"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
    
    // Optionally log to API
    if (typeof window !== "undefined") {
      fetch("/api/log/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      }).catch((e) => {
        console.error("Failed to log error:", e);
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          페이지를 불러올 수 없습니다
        </h2>
        <p className="text-gray-600 mb-6">
          문제가 지속되면 고객센터로 문의해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#F5472C] text-white rounded-lg font-medium hover:bg-[#d93d25] transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
