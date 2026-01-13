import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for these paths entirely
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/testimonials") ||
    pathname.startsWith("/coming-soon") ||
    (pathname.startsWith("/level-test") && !pathname.includes("/result"))  // Allow level-test pages
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!token?.userId) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== "admin") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Protected routes
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

  // No token = redirect to signup
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/signup", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // REMOVED: Trial/subscription check that was causing infinite redirect
  // Let the page handle subscription logic instead of middleware
  // This prevents redirect loops for new users

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
