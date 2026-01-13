"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">심각한 오류가 발생했습니다</h2>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-[#F5472C] text-white rounded-lg font-medium hover:bg-[#d93d25] transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
