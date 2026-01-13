"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import CheckoutButton from "@/components/pricing/CheckoutButton";

export default function SubscribeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup?callbackUrl=/subscribe");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const trialActive = session?.user?.trialActive ?? false;
  const subscriptionActive = session?.user?.subscriptionActive ?? false;

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            구독 관리
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl">
            구독 플랜 관리
          </h1>
        </div>

        <div className="space-y-6">
          {/* Current Status */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              현재 상태
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">체험 상태</span>
                <span
                  className={`text-sm font-semibold ${
                    trialActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {trialActive ? "진행 중" : "종료"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  구독 상태
                </span>
                <span
                  className={`text-sm font-semibold ${
                    subscriptionActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {subscriptionActive ? "활성화" : "비활성화"}
                </span>
              </div>
            </div>
          </section>

          {/* Subscription Plans */}
          {!subscriptionActive && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 sm:text-xl">
                플랜 선택
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="mb-2 text-lg font-semibold">월간 플랜</h3>
                  <p className="mb-4 text-2xl font-bold text-[#F5472C]">
                    ₩49,000
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      / 월
                    </span>
                  </p>
                  <CheckoutButton plan="monthly" label="월간 구독 시작 →" />
                </div>
                <div className="rounded-xl border-2 border-[#F5472C] bg-[#FFF7F0] p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#F5472C] px-2 py-0.5 text-xs font-semibold text-white">
                      추천
                    </span>
                    <h3 className="text-lg font-semibold">연간 플랜</h3>
                  </div>
                  <p className="mb-4 text-2xl font-bold text-[#F5472C]">
                    ₩39,000
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      / 월
                    </span>
                  </p>
                  <p className="mb-4 text-xs text-gray-600">
                    연간 결제 시 17% 할인
                  </p>
                  <CheckoutButton plan="annual" label="연간 구독 시작 →" />
                </div>
              </div>
            </section>
          )}

          {/* Active Subscription */}
          {subscriptionActive && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                활성 구독
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                구독이 활성화되어 있습니다. 언제든지 해지할 수 있으며,
                결제 기간 종료까지 서비스를 이용하실 수 있습니다.
              </p>
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                계정 상세 보기 →
              </Link>
            </section>
          )}

          <div className="flex justify-center">
            <Link
              href="/learning-room"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C]"
            >
              ← 학습룸으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
