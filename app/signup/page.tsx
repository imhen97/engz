import type { Metadata } from "next";
import { Suspense } from "react";

import NavBar from "@/components/NavBar";
import SignupPageContent from "@/components/auth/SignupPageContent";

export const metadata: Metadata = {
  title: "ENGZ 가입 | 7일 무료 체험 시작하기",
  description:
    "카카오, Google, 이메일 중 원하는 방식으로 로그인하고 ENGZ AI 7일 무료 체험을 바로 시작해 보세요.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
        <SignupPageContent />
      </Suspense>
    </main>
  );
}
