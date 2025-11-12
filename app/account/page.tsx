import { Suspense } from "react";
import AccountContent from "@/components/account/AccountContent";

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <AccountContent />
    </Suspense>
  );
}

