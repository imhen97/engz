"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const socialProviders = [
  {
    id: "kakao",
    label: "카카오 계정으로 시작하기",
  },
  {
    id: "google",
    label: "Google 계정으로 시작하기",
  },
];

export default function SignInForm() {
  const searchParams = useSearchParams();
  // 기본적으로 /pricing으로 이동하되, callbackUrl이 있으면 사용
  const callbackUrl = searchParams.get("callbackUrl") ?? "/pricing";
  const errorParam = searchParams.get("error");

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoading = loadingProvider !== null;

  const handleProviderSignIn = async (providerId: string) => {
    setError(null);
    setLoadingProvider(providerId);
    try {
      // OAuth의 경우 NextAuth가 자동으로 리다이렉트 처리
      // redirect: true로 설정하면 카카오/구글 로그인 페이지로 이동
      const result = await signIn(providerId, {
        callbackUrl,
        redirect: true,
      });
      
      // redirect: true일 때는 여기 도달하지 않지만, 
      // 혹시 에러가 발생하면 처리
      if (result?.error) {
        console.error("로그인 오류:", result.error);
        setError(
          result.error === "Configuration"
            ? "로그인 설정에 문제가 있습니다. 관리자에게 문의해 주세요."
            : result.error === "AccessDenied"
            ? "로그인이 거부되었습니다."
            : "로그인 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        setLoadingProvider(null);
      }
    } catch (err) {
      console.error("로그인 예외:", err);
      setError("예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.");
      setLoadingProvider(null);
    }
  };

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setError(null);
    setLoadingProvider("email");
    await signIn("email", {
      email,
      callbackUrl,
      redirect: true,
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C]">
          JOIN ENGZ AI
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          7일 무료 체험으로 ENGZ AI를 경험해 보세요
        </h1>
        <p className="text-sm text-gray-600">
          가입 후 7일 동안 모든 기능을 무료로 체험하고, 언제든지 해지할 수
          있습니다.
        </p>
      </div>

      {errorParam && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorParam === "AuthError"
            ? "로그인 중 오류가 발생했습니다. 다시 시도해 주세요."
            : errorParam === "Configuration"
            ? "로그인 설정에 문제가 있습니다. 관리자에게 문의해 주세요."
            : "로그인에 실패했습니다. 다시 시도해 주세요."}
        </div>
      )}

      <div className="space-y-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleProviderSignIn(provider.id)}
            disabled={isLoading}
            className="w-full rounded-full bg-[#FBE44D] px-6 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingProvider === provider.id ? "연결 중…" : provider.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleEmailSignIn} className="mt-6 space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            이메일로 가입하기
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-[#F5472C] focus:outline-none"
            required
          />
        </div>
        {error && <p className="text-sm text-[#F5472C]">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#FBE44D] px-6 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingProvider === "email"
            ? "메일 전송 중…"
            : "이메일로 로그인 링크 받기"}
        </button>
      </form>

      {isLoading && (
        <div className="mt-8 rounded-2xl bg-[#FFF7F0] px-4 py-5 text-center text-sm text-[#F5472C]">
          AI 학습 환경을 준비 중입니다… 곧 다음 단계로 이동합니다.
        </div>
      )}

      <p className="mt-6 text-center text-xs text-gray-400">
        가입 버튼을 클릭하면 서비스 이용약관과 개인정보 처리방침에 동의한 것으로
        간주합니다.
      </p>
    </div>
  );
}
