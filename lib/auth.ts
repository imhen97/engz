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
      profile(profile) {
        return {
          id: profile.id.toString(),
          name:
            profile.kakao_account?.profile?.nickname ||
            profile.kakao_account?.name ||
            profile.properties?.nickname ||
            null,
          email: profile.kakao_account?.email || null,
          image:
            profile.kakao_account?.profile?.profile_image_url ||
            profile.properties?.profile_image ||
            null,
        } as any; // Type assertion to avoid type conflict with extended User type
      },
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".eng-z.com" : undefined,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".eng-z.com" : undefined,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".eng-z.com" : undefined,
      },
    },
  },
  providers,
  pages: {
    signIn: "/signup",
    error: "/signup",
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async createUser({ user }) {
      try {
        console.log("✅ 새 사용자 생성 이벤트:", user.id, user.email);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            trialActive: true,
            trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            subscriptionActive: false,
          },
        });
        console.log("✅ 사용자 초기 설정 완료:", user.id);
      } catch (error) {
        console.error("❌ createUser 이벤트 오류:", error);
        // 오류가 발생해도 로그인은 계속 진행되도록 함
        // (이미 PrismaAdapter가 사용자를 생성했을 수 있음)
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Provider가 설정되지 않은 경우 체크
        if (providers.length === 0) {
          console.error(
            "❌ 로그인 제공자가 설정되지 않았습니다. 환경 변수를 확인해 주세요."
          );
          return false;
        }

        // 데이터베이스 연결 확인
        try {
          await prisma.$queryRaw`SELECT 1`;
        } catch (dbError) {
          console.error("❌ 데이터베이스 연결 실패:", dbError);
          // 데이터베이스 연결 실패해도 로그인은 허용 (PrismaAdapter가 처리)
        }

        console.log("✅ signIn callback 성공:", user?.email, account?.provider);

        // 로그인 후 자동 구독 체크 (비동기로 실행, 로그인을 막지 않음)
        if (user?.id) {
          import("@/lib/subscription")
            .then(({ checkAndStartSubscription }) => {
              checkAndStartSubscription(user.id);
            })
            .catch((error) => {
              console.error("자동 구독 체크 실패:", error);
            });
        }

        // 모든 로그인 허용
        return true;
      } catch (error) {
        console.error("❌ signIn callback 오류:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        console.log("🔵 Redirect 콜백 호출:", { url, baseUrl });

        // callbackUrl이 있으면 그대로 사용
        if (url.startsWith("/")) {
          // 기본 홈페이지("/")가 아닌 경우에만 사용
          if (url !== "/" && url !== baseUrl) {
            console.log("✅ Redirect:", `${baseUrl}${url}`);
            return `${baseUrl}${url}`;
          }
        }
        // 외부 URL이면 baseUrl과 비교
        try {
          const urlObj = new URL(url);
          if (urlObj.origin === baseUrl) {
            const pathname = urlObj.pathname;
            // 기본 홈페이지가 아닌 경우에만 사용
            if (pathname !== "/" && pathname !== baseUrl) {
              console.log("✅ Redirect:", url);
              return url;
            }
          }
        } catch {
          // URL 파싱 실패 시 기본값 반환
        }
        // 기본값은 /learning-room (ENGZ AI Learning Room)
        console.log("✅ Redirect 기본값:", `${baseUrl}/learning-room`);
        return `${baseUrl}/learning-room`;
      } catch (error) {
        console.error("❌ redirect callback 오류:", error);
        return `${baseUrl}/learning-room`;
      }
    },
    async jwt({ token, user, trigger }) {
      try {
        if (user) {
          console.log("✅ JWT 토큰 생성 - 사용자:", user.id, user.email);
          token.userId = user.id;
          token.plan = user.plan ?? "free";
          token.trialActive = user.trialActive ?? false;
          token.trialEndsAt = user.trialEndsAt?.toISOString() ?? null;
          token.subscriptionActive = user.subscriptionActive ?? false;
          return token;
        }
        if (trigger === "update") {
          return await enrichToken(token);
        }
        return await enrichToken(token);
      } catch (error) {
        console.error("❌ JWT callback 오류:", error);
        // 오류가 발생해도 기본 토큰 반환
        return token;
      }
    },
    async session({ session, token }) {
      try {
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
      } catch (error) {
        console.error("❌ Session callback 오류:", error);
        // 오류가 발생해도 기본 세션 반환
        return session;
      }
    },
  },
};
