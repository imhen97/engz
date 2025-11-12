import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import SignInForm from "@/components/auth/SignInForm";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "ENGZ 가입 | 7일 무료 체험 시작하기",
  description:
    "카카오, Google, 이메일 중 원하는 방식으로 로그인하고 ENGZ AI 7일 무료 체험을 바로 시작해 보세요.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pt-28 pb-16 lg:flex-row lg:items-center lg:gap-16">
        <section className="flex-1 rounded-3xl bg-gradient-to-br from-[#F5472C] via-[#FF7A55] to-[#FFC3B3] p-10 text-white shadow-2xl">
          <div className="max-w-lg space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
              ENGZ AI EXPERIENCE
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              AI 코치와 4주 만에 영어 말하기 루틴을 완성해 보세요
            </h1>
            <p className="text-sm leading-relaxed text-white/90">
              카카오 또는 Google 계정으로 단 1분 만에 가입하고, AI 레벨 테스트와
              4주 집중 코스 전체를 7일 동안 무료로 체험할 수 있습니다. 언제든지
              해지 가능하며 추가 비용은 청구되지 않습니다.
            </p>
            <ul className="space-y-3 text-sm text-white/90">
              <li>• AI 레벨 테스트 + 맞춤 성장 리포트</li>
              <li>• 4주 집중 미션과 1:1 피드백</li>
              <li>• 해지하지 않으면 체험 종료 후 자동 갱신</li>
            </ul>
            <p className="text-xs text-white/70">
              이미 계정이 있으신가요?{" "}
              <Link href="/pricing" className="underline">
                요금제를 확인하고 계속 진행하세요.
              </Link>
            </p>
          </div>
        </section>

        <section className="flex w-full max-w-lg flex-1 justify-center">
          <Suspense
            fallback={<div className="text-sm text-gray-500">로딩 중…</div>}
          >
            <SignInForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
