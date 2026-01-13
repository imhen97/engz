"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

import SignInForm from "@/components/auth/SignInForm";

export default function SignupPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use ref instead of state to prevent re-renders
  const hasRedirected = useRef(false);

  const safeCallbackUrl = useMemo(() => {
    // 1. URL 파라미터에서 callbackUrl 확인
    let rawCallbackUrl = searchParams.get("callbackUrl");

    // 2. URL 파라미터에 없으면 sessionStorage에서 확인 (OAuth 리다이렉트 후)
    if (!rawCallbackUrl && typeof window !== "undefined") {
      rawCallbackUrl = sessionStorage.getItem("authCallbackUrl");
      // 사용 후 삭제
      if (rawCallbackUrl) {
        sessionStorage.removeItem("authCallbackUrl");
      }
    }

    if (!rawCallbackUrl) {
      return "/learning-room"; // Default to learning-room instead of dashboard
    }

    if (rawCallbackUrl.startsWith("/")) {
      return rawCallbackUrl;
    }

    try {
      if (typeof window !== "undefined") {
        const resolved = new URL(rawCallbackUrl, window.location.origin);

        if (resolved.origin === window.location.origin) {
          return `${resolved.pathname}${resolved.search}${resolved.hash}`;
        }
      }
    } catch {
      // Invalid URL, use default
    }

    return "/learning-room";
  }, [searchParams]);

  useEffect(() => {
    // Only redirect once
    if (hasRedirected.current) return;
    
    // Only redirect when status is "authenticated" (not "loading")
    if (status === "authenticated") {
      hasRedirected.current = true;
      
      // Use router.replace instead of window.location.replace
      // to prevent full page reload which causes more session calls
      router.replace(safeCallbackUrl);
    }
  }, [status, safeCallbackUrl, router]); // REMOVED: session from dependencies

  // 로딩 중이거나 이미 로그인된 경우
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">로딩 중…</p>
      </div>
    );
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B3D] border-t-transparent mx-auto"></div>
          <p className="text-sm text-gray-500">리다이렉트 중…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 pt-24 pb-12 sm:gap-8 sm:px-6 sm:pt-28 sm:pb-16 md:gap-10 md:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
      <section className="flex-1 rounded-2xl bg-gradient-to-br from-[#F5472C] via-[#FF7A55] to-[#FFC3B3] p-6 text-white shadow-2xl sm:rounded-3xl sm:p-8 md:p-10">
        <div className="max-w-lg space-y-4 sm:space-y-5 md:space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80 sm:text-sm">
            ENGZ AI EXPERIENCE
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            AI 코치와 4주 만에 영어 말하기 루틴을 완성해 보세요
          </h1>
          <p className="text-xs leading-relaxed text-white/90 sm:text-sm">
            카카오 또는 Google 계정으로 단 1분 만에 가입하고, AI 레벨 테스트와
            4주 집중 코스 전체를 7일 동안 무료로 체험할 수 있습니다. 언제든지
            해지 가능하며 추가 비용은 청구되지 않습니다.
          </p>
          <ul className="space-y-2 text-xs text-white/90 sm:space-y-3 sm:text-sm">
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
  );
}
