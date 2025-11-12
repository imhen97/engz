"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

// 컴포넌트 마운트 확인
console.log("✅ SignInForm 컴포넌트 로드됨");

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

  useEffect(() => {
    console.log("✅ SignInForm 마운트 완료");
    console.log("✅ signIn 함수 타입:", typeof signIn);
    console.log("✅ callbackUrl:", callbackUrl);
  }, [callbackUrl]);

  const handleProviderSignIn = async (providerId: string) => {
    console.log("🔵 버튼 클릭됨! providerId:", providerId);
    setError(null);
    setLoadingProvider(providerId);

    try {
      console.log(`[${providerId}] 로그인 시작, callbackUrl:`, callbackUrl);
      console.log(`[${providerId}] signIn 함수 호출 전`);

      // signIn 함수가 존재하는지 확인
      if (typeof signIn !== "function") {
        console.error("❌ signIn 함수가 정의되지 않았습니다!");
        setError(
          "로그인 기능을 사용할 수 없습니다. 페이지를 새로고침해 주세요."
        );
        setLoadingProvider(null);
        return;
      }

      console.log(`[${providerId}] signIn 함수 호출 중...`);

      // OAuth의 경우 redirect: true로 설정하면 NextAuth가 자동으로 OAuth 제공자로 리다이렉트
      // redirect: true일 때는 이 함수가 완료되기 전에 페이지가 리다이렉트되므로
      // result를 받을 수 없습니다. 에러가 발생하면 NextAuth가 error 페이지로 리다이렉트합니다.
      await signIn(providerId, {
        callbackUrl,
        redirect: true, // OAuth는 자동 리다이렉트 필요
      });

      // redirect: true일 때는 여기에 도달하지 않지만,
      // 혹시 에러가 발생하면 NextAuth가 자동으로 /signup?error=AuthError로 리다이렉트합니다.
    } catch (err) {
      console.error(`[${providerId}] 로그인 예외:`, err);
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
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:rounded-3xl sm:p-8">
      <div className="mb-6 space-y-2 text-center sm:mb-8">
        <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C]">
          JOIN ENGZ AI
        </p>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          7일 무료 체험으로 ENGZ AI를 경험해 보세요
        </h1>
        <p className="text-xs text-gray-600 sm:text-sm">
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
            onClick={(e) => {
              e.preventDefault();
              console.log("🟢 버튼 클릭 이벤트 발생:", provider.id);
              handleProviderSignIn(provider.id);
            }}
            disabled={isLoading}
            className="w-full rounded-full bg-[#FBE44D] px-5 py-2.5 text-xs font-semibold text-gray-900 shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
          >
            {loadingProvider === provider.id ? "연결 중…" : provider.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleEmailSignIn} className="mt-5 space-y-3 sm:mt-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700 sm:text-sm"
          >
            이메일로 가입하기
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-700 focus:border-[#F5472C] focus:outline-none sm:py-3 sm:text-sm"
            required
          />
        </div>
        {error && <p className="text-xs text-[#F5472C] sm:text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#FBE44D] px-5 py-2.5 text-xs font-semibold text-gray-900 shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
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
