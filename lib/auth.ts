import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

import prisma from "./prisma";

const providers = [] as AuthOptions["providers"]; // ensure typing

// Validate and add Google provider
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  );
} else {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ GOOGLE_ID 또는 GOOGLE_SECRET 환경 변수가 설정되지 않았습니다. Google 로그인이 작동하지 않습니다."
    );
  } else {
    console.warn(
      "⚠️ GOOGLE_ID 또는 GOOGLE_SECRET 환경 변수가 설정되지 않았습니다."
    );
  }
}

// Validate and add Kakao provider
if (process.env.KAKAO_ID && process.env.KAKAO_SECRET) {
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
    })
  );
} else {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ KAKAO_ID 또는 KAKAO_SECRET 환경 변수가 설정되지 않았습니다. Kakao 로그인이 작동하지 않습니다."
    );
  } else {
    console.warn(
      "⚠️ KAKAO_ID 또는 KAKAO_SECRET 환경 변수가 설정되지 않았습니다."
    );
  }
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  try {
    const EmailProvider = (
      eval("require")(
        "next-auth/providers/email"
      ) as typeof import("next-auth/providers/email")
    ).default;
    providers.push(
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      })
    );
  } catch (error) {
    console.error("이메일 제공자를 로드하지 못했습니다:", error);
  }
} else {
  console.warn("EMAIL_SERVER 또는 EMAIL_FROM 환경 변수가 설정되지 않았습니다.");
}

async function enrichToken(token: any) {
  if (!token?.userId) return token;
  try {
    const user = await prisma.user.findUnique({
      where: { id: token.userId as string },
    });
    if (!user) return token;
    token.plan = user.plan;
    token.trialActive = user.trialActive;
    token.trialEndsAt = user.trialEndsAt?.toISOString() ?? null;
    token.subscriptionActive = user.subscriptionActive;
  } catch (error) {
    console.error("토큰 보강 중 오류:", error);
    // 오류 발생 시 기존 토큰 값 유지
  }
  return token;
}

// Validate NEXTAUTH_SECRET
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다. 인증이 작동하지 않습니다."
    );
  } else {
    console.warn("⚠️ NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.");
  }
}

// Validate NEXTAUTH_URL
if (!process.env.NEXTAUTH_URL) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ NEXTAUTH_URL 환경 변수가 설정되지 않았습니다. 프로덕션에서는 https://www.eng-z.com으로 설정해야 합니다."
    );
  } else {
    console.warn(
      "⚠️ NEXTAUTH_URL 환경 변수가 설정되지 않았습니다. 개발 환경에서는 http://localhost:3000을 사용합니다."
    );
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/signup",
    error: "/signup?error=AuthError",
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          trialActive: true,
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          subscriptionActive: false,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // 모든 로그인 허용
        return true;
      } catch (error) {
        console.error("signIn callback 오류:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // callbackUrl이 있으면 그대로 사용
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        // 외부 URL이면 baseUrl과 비교
        try {
          const urlObj = new URL(url);
          if (urlObj.origin === baseUrl) {
            return url;
          }
        } catch {
          // URL 파싱 실패 시 baseUrl 반환
        }
        return baseUrl;
      } catch (error) {
        console.error("redirect callback 오류:", error);
        return baseUrl;
      }
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.id;
        token.plan = user.plan;
        token.trialActive = user.trialActive;
        token.trialEndsAt = user.trialEndsAt?.toISOString() ?? null;
        token.subscriptionActive = user.subscriptionActive;
        return token;
      }
      if (trigger === "update") {
        return enrichToken(token);
      }
      return enrichToken(token);
    },
    async session({ session, token }) {
      if (session.user && token?.userId) {
        session.user.id = token.userId as string;
        session.user.plan = (token.plan as string) ?? "free";
        session.user.trialActive = Boolean(token.trialActive);
        session.user.trialEndsAt = token.trialEndsAt
          ? new Date(token.trialEndsAt as string)
          : null;
        session.user.subscriptionActive = Boolean(token.subscriptionActive);
      }
      return session;
    },
  },
};
