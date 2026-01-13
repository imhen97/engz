"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiResponse, SubscriptionPlan } from "@/types";

interface CheckoutResponse {
  url: string;
}

type CheckoutButtonProps = {
  plan: SubscriptionPlan;
  label: string;
  variant?: "solid" | "outline";
  disabled?: boolean;
};

export default function CheckoutButton({
  plan,
  label,
  variant = "solid",
  disabled = false,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (): Promise<void> => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);

    try {
      console.log("🔵 Checkout 요청 시작:", { plan });
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      console.log("🔵 Checkout 응답 상태:", response.status);

      if (response.status === 401) {
        // 인증이 필요한 경우 로그인 페이지로 리다이렉트
        console.log("⚠️ 인증 필요 - 로그인 페이지로 리다이렉트");
        setLoading(false);
        router.push(`/signup?callbackUrl=${encodeURIComponent("/pricing")}`);
        return;
      }

      if (!response.ok) {
        // 응답 본문에서 에러 메시지 추출 시도
        let errorMessage = "결제 페이지 연결에 실패했습니다.";
        try {
          const errorData = (await response.json()) as ApiResponse<never>;
          console.error("❌ Checkout 에러 응답:", errorData);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // JSON 파싱 실패 시 기본 메시지 사용
          console.error("❌ 응답 파싱 실패:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as CheckoutResponse;
      console.log("✅ Checkout 성공:", { hasUrl: !!data.url });
      if (data.url) {
        // Stripe Checkout 페이지로 리다이렉트
        window.location.href = data.url;
      } else {
        throw new Error("Stripe 세션 URL을 불러오지 못했습니다.");
      }
    } catch (err) {
      // 네트워크 에러나 기타 에러 처리
      console.error("❌ Checkout 예외:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const baseClass =
    "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60";

  const variantClass =
    variant === "solid"
      ? "bg-[#F5472C] text-white"
      : "border border-[#F5472C] text-[#F5472C] hover:bg-[#F5472C] hover:text-white";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={disabled || loading}
        className={`${baseClass} ${variantClass}`}
      >
        {loading ? "연결 중…" : label}
      </button>
      {error && <p className="text-xs text-[#F5472C]">{error}</p>}
    </div>
  );
}
