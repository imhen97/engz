import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/dashboard", "/courses"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;
  const needsProtection = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!needsProtection) {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/signup", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const trialActive = Boolean(token.trialActive);
  const subscriptionActive = Boolean(token.subscriptionActive);

  if (!trialActive && !subscriptionActive) {
    const url = new URL("/pricing", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*"],
};
