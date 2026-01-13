import { NextRequest, NextResponse } from "next/server";
import { AppError, AuthenticationError, AuthorizationError } from "./errors";
import { getToken } from "next-auth/jwt";

type ApiHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

interface ApiHandlerOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function withErrorHandler(
  handler: ApiHandler,
  options: ApiHandlerOptions = {}
) {
  return async (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      // Auth check
      if (options.requireAuth || options.requireAdmin) {
        // Try both cookie names for compatibility
        let token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          cookieName: "next-auth.session-token",
        });
        
        if (!token) {
          token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: "__Secure-next-auth.session-token",
          });
        }
        
        if (!token) {
          console.error("❌ API Auth check failed: No token found");
          throw new AuthenticationError();
        }

        if (options.requireAdmin && token.role !== "admin") {
          throw new AuthorizationError("관리자 권한이 필요합니다");
        }
      }

      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code,
            ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
          },
          { status: error.statusCode }
        );
      }

      // Prisma errors
      if (error instanceof Error && error.message.includes("Prisma")) {
        return NextResponse.json(
          {
            success: false,
            error: "데이터베이스 오류가 발생했습니다",
            code: "DATABASE_ERROR",
          },
          { status: 500 }
        );
      }

      // Unknown errors
      return NextResponse.json(
        {
          success: false,
          error: "서버 오류가 발생했습니다",
          code: "INTERNAL_ERROR",
          ...(process.env.NODE_ENV === "development" && {
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        },
        { status: 500 }
      );
    }
  };
}

// Helper for successful responses
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

// Helper for error responses
export function apiError(message: string, status: number = 400, code?: string) {
  return NextResponse.json({ success: false, error: message, code }, { status });
}

// Helper to get token with both possible cookie names
export async function getAuthToken(req: NextRequest) {
  // Try regular cookie name first
  let token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });
  
  // Fall back to secure cookie name (used in production with HTTPS)
  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "__Secure-next-auth.session-token",
    });
  }
  
  return token;
}
