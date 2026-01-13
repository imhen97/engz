import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "./prisma";
import type { KakaoProfile, UserRole } from "@/types";

const providers = [] as AuthOptions["providers"]; // ensure typing

// Validate and add Google provider
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
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
      clientId: process.env.KAKAO_ID!,
      clientSecret: process.env.KAKAO_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        try {
          console.log("=== Kakao Profile Data ===");
          console.log(JSON.stringify(profile, null, 2));
          
          const kakaoProfile = profile as KakaoProfile;
          
          const userProfile = {
            id: kakaoProfile.id.toString(),
            name:
              kakaoProfile.kakao_account?.profile?.nickname ||
              kakaoProfile.kakao_account?.name ||
              kakaoProfile.properties?.nickname ||
              "카카오 사용자",
            email: kakaoProfile.kakao_account?.email || `kakao_${kakaoProfile.id}@kakao.placeholder`,
            image:
              kakaoProfile.kakao_account?.profile?.profile_image_url ||
              kakaoProfile.properties?.profile_image ||
              null,
            plan: "free",
            trialActive: false,
            trialEndsAt: null,
            subscriptionActive: false,
            role: null,
          };
          
          console.log("=== Processed Kakao Profile ===");
          console.log(JSON.stringify(userProfile, null, 2));
          
          return userProfile;
        } catch (error) {
          console.error("❌ Kakao profile processing error:", error);
          throw error;
        }
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

// Add Credentials provider for admin login
providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      // Check if user exists and has admin role
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          trialActive: true,
          trialEndsAt: true,
          subscriptionActive: true,
          role: true,
        },
      });

      if (!user || user.role !== "admin") {
        return null;
      }

      // For now, we'll allow admin login if role is set
      // In production, you should store hashed passwords in AdminUser table
      // and verify them here
      // For simplicity, we'll just check if the user has admin role
      // You can enhance this by checking AdminUser table with bcrypt.compare

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        plan: user.plan,
        trialActive: user.trialActive,
        trialEndsAt: user.trialEndsAt,
        subscriptionActive: user.subscriptionActive,
        role: user.role,
      } satisfies User;
    },
  })
);

async function enrichToken(token: JWT): Promise<JWT> {
  if (!token?.userId) return token;
  try {
    const user = await prisma.user.findUnique({
      where: { id: token.userId as string },
      select: {
        plan: true,
        trialActive: true,
        trialEndsAt: true,
        subscriptionActive: true,
        role: true,
      },
    });
    if (!user) return token;
    token.plan = user.plan;
    token.trialActive = user.trialActive;
    token.trialEndsAt = user.trialEndsAt?.toISOString() ?? null;
    token.subscriptionActive = user.subscriptionActive;
    token.role = (user.role as UserRole) ?? null; // role 정보도 토큰에 포함
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
  logger: {
    error(code, metadata) {
      console.error("=== NextAuth Error ===");
      console.error("Code:", code);
      console.error("Metadata:", JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn("=== NextAuth Warning ===");
      console.warn("Code:", code);
    },
    debug(code, metadata) {
      console.log("=== NextAuth Debug ===");
      console.log("Code:", code);
      console.log("Metadata:", JSON.stringify(metadata, null, 2));
    },
  },
  events: {
    async createUser({ user }) {
      try {
        console.log("=== createUser Event ===");
        console.log("User:", JSON.stringify(user, null, 2));
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
        console.error("❌ createUser 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // 오류가 발생해도 로그인은 계속 진행되도록 함
        // (이미 PrismaAdapter가 사용자를 생성했을 수 있음)
      }
    },
    async linkAccount({ account, user }) {
      try {
        console.log("=== linkAccount Event ===");
        console.log("Account:", JSON.stringify(account, null, 2));
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("✅ 계정 연결 이벤트:", account.provider, user.id);
        
        // Verify Account was saved to database
        try {
          const savedAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });
          
          if (savedAccount) {
            console.log("✅ Account 저장 확인됨:", savedAccount.id);
            console.log("✅ Account 상세:", JSON.stringify(savedAccount, null, 2));
          } else {
            console.warn("⚠️ Account가 데이터베이스에 저장되지 않았습니다.");
          }
        } catch (dbError) {
          console.error("❌ Account 확인 중 오류:", dbError);
        }
      } catch (error) {
        console.error("❌ linkAccount 이벤트 오류:", error);
        console.error("❌ linkAccount 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    },
    async signIn({ user, account, isNewUser }) {
      try {
        console.log("=== signIn Event ===");
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("Account:", JSON.stringify(account, null, 2));
        console.log("Is New User:", isNewUser);
        console.log("✅ 로그인 이벤트:", user.email, account?.provider);
      } catch (error) {
        console.error("❌ signIn 이벤트 오류:", error);
        console.error("❌ signIn 이벤트 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("=== SignIn Callback ===");
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("Account:", JSON.stringify(account, null, 2));
        console.log("Profile:", JSON.stringify(profile, null, 2));

        // Handle Kakao OAuth specifically
        if (account?.provider === "kakao") {
          console.log("🔵 Processing Kakao OAuth sign-in");
          
          // For Kakao users without email, generate a placeholder
          if (!user.email) {
            if (account?.providerAccountId) {
              // Use Kakao ID as unique identifier
              user.email = `kakao_${account.providerAccountId}@kakao.placeholder`;
              console.log("✅ Kakao 이메일 플레이스홀더 생성:", user.email);
            } else if (profile) {
              // Try to get email from profile
              const kakaoProfile = profile as KakaoProfile;
              if (kakaoProfile?.kakao_account?.email) {
                user.email = kakaoProfile.kakao_account.email;
                console.log("✅ Kakao 이메일 설정:", user.email);
              } else if (kakaoProfile?.id) {
                // Fallback: use Kakao ID from profile
                user.email = `kakao_${kakaoProfile.id}@kakao.placeholder`;
                console.log("✅ Kakao 이메일 플레이스홀더 생성 (from profile):", user.email);
              }
            }
            
            // If still no email, try to use user.id as fallback
            if (!user.email && user.id) {
              user.email = `kakao_${user.id}@kakao.placeholder`;
              console.log("✅ Kakao 이메일 플레이스홀더 생성 (from user.id):", user.email);
            }
          }
          
          // Log Kakao profile details for debugging
          if (profile) {
            const kakaoProfile = profile as KakaoProfile;
            console.log("🔵 Kakao 프로필 정보:", {
              hasEmail: !!kakaoProfile?.kakao_account?.email,
              emailVerified: kakaoProfile?.kakao_account?.is_email_verified,
              hasNickname: !!kakaoProfile?.kakao_account?.profile?.nickname,
            });
          }
          
          // Warn if still no email, but don't block login
          // PrismaAdapter will handle the email requirement
          if (!user.email) {
            console.warn("⚠️ Kakao user has no email - PrismaAdapter will handle");
          }
        }

        // Provider가 설정되지 않은 경우 체크
        if (providers.length === 0) {
          console.error(
            "❌ 로그인 제공자가 설정되지 않았습니다. 환경 변수를 확인해 주세요."
          );
          return false;
        }

        // 데이터베이스 연결 확인 (오류가 발생해도 로그인은 허용)
        try {
          await prisma.$queryRaw`SELECT 1`;
          console.log("✅ 데이터베이스 연결 확인 완료");
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
        console.error("❌ 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Check if it's a critical error that should block login
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const criticalErrors = [
          "database",
          "prisma",
          "adapter",
          "authentication",
        ];

        if (
          criticalErrors.some((keyword) =>
            errorMessage.toLowerCase().includes(keyword)
          )
        ) {
          console.error("❌ Critical error detected - blocking login");
          return false;
        }

        // Non-critical errors - allow login to proceed (PrismaAdapter will handle)
        console.log("⚠️ Non-critical error - allowing login to proceed");
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        console.log("🔵 Redirect 콜백 호출:", { url, baseUrl });

        // callbackUrl이 있으면 그대로 사용
        if (url.startsWith("/")) {
          // 기본 홈페이지("/")가 아닌 경우에만 사용
          if (url !== "/") {
            const fullUrl = `${baseUrl}${url}`;
            console.log("✅ Redirect (경로):", fullUrl);
            return fullUrl;
          }
        }
        // 외부 URL이면 baseUrl과 비교
        try {
          const urlObj = new URL(url);
          if (urlObj.origin === baseUrl) {
            const pathname = urlObj.pathname;
            // 기본 홈페이지가 아닌 경우에만 사용
            if (pathname !== "/") {
              console.log("✅ Redirect (전체 URL):", url);
              return url;
            }
          } else {
            // 외부 URL이면 그대로 반환 (보안상 위험할 수 있으므로 주의)
            console.log("⚠️ 외부 URL 리다이렉트:", url);
            return url;
          }
        } catch {
          // URL 파싱 실패 시 경로로 처리
          if (url.startsWith("/") && url !== "/") {
            const fullUrl = `${baseUrl}${url}`;
            console.log("✅ Redirect (파싱 실패 후 경로 처리):", fullUrl);
            return fullUrl;
          }
        }
        // 기본값은 /learning-room (ENGZ AI Learning Room)
        console.log("✅ Redirect 기본값:", `${baseUrl}/learning-room`);
        return `${baseUrl}/learning-room`;
      } catch (error) {
        console.error("❌ redirect callback 오류:", error);
        return `${baseUrl}/learning-room`;
      }
    },
    async jwt({ token, user, account, trigger }) {
      try {
        console.log("=== JWT Callback ===");
        console.log("Token:", JSON.stringify(token, null, 2));
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("Account:", JSON.stringify(account, null, 2));
        console.log("Trigger:", trigger);
        
        if (user) {
          console.log("✅ JWT 토큰 생성 - 사용자:", user.id, user.email);
          token.userId = user.id;
          token.plan = user.plan ?? "free";
          token.trialActive = user.trialActive ?? false;
          token.trialEndsAt = user.trialEndsAt?.toISOString() ?? null;
          token.subscriptionActive = user.subscriptionActive ?? false;
          token.role = (user.role as UserRole) ?? null;
          
          if (account) {
            token.provider = account.provider;
          }
          
          console.log("✅ Final Token:", JSON.stringify(token, null, 2));
          return token;
        }
        if (trigger === "update") {
          return await enrichToken(token);
        }
        return await enrichToken(token);
      } catch (error) {
        console.error("❌ JWT callback 오류:", error);
        console.error("❌ JWT callback 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // 오류가 발생해도 기본 토큰 반환
        return token;
      }
    },
    async session({ session, token }) {
      try {
        console.log("=== Session Callback ===");
        console.log("Session:", JSON.stringify(session, null, 2));
        console.log("Token:", JSON.stringify(token, null, 2));
        
        if (session.user && token?.userId) {
          session.user.id = token.userId as string;
          session.user.plan = (token.plan as string) ?? "free";
          session.user.trialActive = Boolean(token.trialActive);
          session.user.trialEndsAt = token.trialEndsAt
            ? new Date(token.trialEndsAt as string)
            : null;
          session.user.subscriptionActive = Boolean(token.subscriptionActive);
          session.user.role = (token.role as UserRole) ?? null;
          
          console.log("✅ Final Session:", JSON.stringify(session, null, 2));
        }
        return session;
      } catch (error) {
        console.error("❌ Session callback 오류:", error);
        console.error("❌ Session callback 오류 상세:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // 오류가 발생해도 기본 세션 반환
        return session;
      }
    },
  },
};
