import { Suspense } from "react";
import OnboardingContent from "@/components/onboarding/OnboardingContent";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <OnboardingContent />
    </Suspense>
  );
}

