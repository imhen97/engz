import { Suspense } from "react";
import SubscribeContent from "@/components/subscribe/SubscribeContent";

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <SubscribeContent />
    </Suspense>
  );
}
