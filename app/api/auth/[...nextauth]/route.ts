import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import type { NextAuthRouteContext } from "@/types";

const handler = NextAuth(authOptions);

export const GET = async (req: NextRequest, context: NextAuthRouteContext) => {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("❌ Auth error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Auth error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Redirect to signup page with error parameter
    const url = new URL("/signup?error=OAuthCallback", req.url);
    return NextResponse.redirect(url);
  }
};

export const POST = async (req: NextRequest, context: NextAuthRouteContext) => {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("❌ Auth error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Auth error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Redirect to signup page with error parameter
    const url = new URL("/signup?error=OAuthCallback", req.url);
    return NextResponse.redirect(url);
  }
};
