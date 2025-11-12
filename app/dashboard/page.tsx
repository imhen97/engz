import { Suspense } from "react";

import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
