import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/dashboard", "/courses"];
const ADMIN_PATHS = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for these paths entirely to prevent redirect loops
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/testimonials") ||
    pathname.startsWith("/coming-soon")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    // Allow login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!token?.userId) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Check if user has admin role from JWT token
    if (token.role !== "admin") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Protected routes - only redirect if NO token
  const protectedRoutes = [
    "/dashboard",
    "/courses",
    "/learning-room",
    "/account",
    "/level-test/result",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/signup", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check trial/subscription for protected routes with token
  if (isProtectedRoute && token) {
    const trialActive = Boolean(token.trialActive);
    const subscriptionActive = Boolean(token.subscriptionActive);

    // Allow access if trial is active OR subscription is active
    // Don't redirect if user just logged in (trialActive might not be set yet)
    if (!trialActive && !subscriptionActive) {
      // Only redirect to pricing if user is definitely not in trial
      // This prevents redirect loops for new users
      const url = new URL("/pricing", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
