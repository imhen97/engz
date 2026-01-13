d"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";

function LevelTestResultLockedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [resultData, setResultData] = useState<any>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Get temporary result from sessionStorage
    const tempResult = sessionStorage.getItem("levelTestTempResult");
    if (tempResult) {
      setResultData(JSON.parse(tempResult));
    } else {
      // No temp result, redirect to start
      router.push("/level-test/start");
    }
  }, [router]);

  // 로그인 후 자동으로 결과 페이지로 리다이렉트 (한 번만 실행)
  useEffect(() => {
    if (status === "authenticated" && session?.user && !hasRedirected) {
      const callbackUrl =
        searchParams.get("callbackUrl") || "/level-test/result";

      // 현재 경로가 이미 목적지와 같으면 리다이렉트하지 않음
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath === callbackUrl) {
          console.log("✅ 이미 목적지 페이지에 있음, 리다이렉트 스킵");
          return;
        }
      }

      console.log("✅ 로그인 완료 - 결과 페이지로 리다이렉트", callbackUrl);
      setHasRedirected(true);

      // 즉시 리다이렉트 시도 (window.location.href 사용)
      if (typeof window !== "undefined") {
        // 즉시 리다이렉트
        window.location.href = callbackUrl;
      } else {
        router.replace(callbackUrl);
      }
    }
  }, [status, session, router, searchParams, hasRedirected]);

  const handleLogin = () => {
    const callbackUrl = searchParams.get("callbackUrl") || "/level-test/result";
    // sessionStorage에 callbackUrl 저장 (OAuth 리다이렉트 후에도 유지)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("authCallbackUrl", callbackUrl);
    }
    // URL 파라미터로 callbackUrl을 전달하여 /signup 페이지로 리다이렉트
    // NextAuth가 이 callbackUrl을 읽어서 로그인 후 해당 경로로 리다이렉트함
    window.location.href = `/signup?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
  };

  // 로그인 중이거나 로그인 완료 후 리다이렉트 중
  if (status === "loading" || (status === "authenticated" && session?.user)) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B3D] border-t-transparent mx-auto"></div>
            <p className="text-sm text-gray-500">리다이렉트 중…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!resultData) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F4] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8 text-6xl">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            테스트 결과 잠금됨
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            AI 분석 리포트를 보려면 로그인해주세요.
          </p>
        </motion.div>

        {/* Blurred result preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10"
        >
          <div className="pointer-events-none select-none blur-sm">
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Vocabulary
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-700">
                  {resultData.vocabScore}%
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Grammar
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-700">
                  {resultData.grammarScore}%
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Writing
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-700">
                  {resultData.writingScore}%
                </p>
              </div>
            </div>
            <div className="h-32 rounded-xl bg-gray-100"></div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-4 text-4xl">🔑</div>
              <p className="text-sm font-semibold text-gray-700">
                로그인하여 전체 결과 보기
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={handleLogin}
            className="rounded-full bg-gradient-to-r from-[#FF6B3D] to-[#ff8a5c] px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            🔑 로그인하고 결과 보기
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default function LevelTestResultLockedPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FFF8F4] text-black">
          <NavBar />
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-gray-500">로딩 중…</p>
          </div>
        </main>
      }
    >
      <LevelTestResultLockedContent />
    </Suspense>
  );
}
