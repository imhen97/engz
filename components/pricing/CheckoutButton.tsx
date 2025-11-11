"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutButtonProps = {
  plan: "monthly" | "annual";
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

  const handleSubscribe = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (response.status === 401) {
        router.push(`/signup?callbackUrl=${encodeURIComponent("/pricing")}`);
        return;
      }

      if (!response.ok) {
        throw new Error("결제 페이지 연결에 실패했습니다.");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe 세션 URL을 불러오지 못했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
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
