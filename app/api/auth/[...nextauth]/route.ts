import NextAuth from "next-auth";
import { NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";
import type { NextAuthRouteContext } from "@/types";

const handler = NextAuth(authOptions);

export const GET = async (req: NextRequest, context: NextAuthRouteContext) => {
  console.log("=== NextAuth GET Handler ===");
  console.log("URL:", req.url);
  console.log("Method:", req.method);

  // Let NextAuth handle everything internally, including errors
  // NextAuth will redirect to authOptions.pages.error ("/signup") on error
  // with appropriate error query parameters
  return await handler(req, context);
};

export const POST = async (req: NextRequest, context: NextAuthRouteContext) => {
  console.log("=== NextAuth POST Handler ===");
  console.log("URL:", req.url);
  console.log("Method:", req.method);

  // Let NextAuth handle everything internally, including errors
  // NextAuth will redirect to authOptions.pages.error ("/signup") on error
  // with appropriate error query parameters
  return await handler(req, context);
};
