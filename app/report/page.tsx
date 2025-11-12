import { Suspense } from "react";
import ReportContent from "@/components/report/ReportContent";

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <ReportContent />
    </Suspense>
  );
}
