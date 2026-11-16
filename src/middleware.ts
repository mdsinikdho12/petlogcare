import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/providers",
  "/blogs",
  "/legal",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check access token, refresh token, or session cookie
  const hasAuthToken =
    request.cookies.has("accessToken") ||
    request.cookies.has("refreshToken") ||
    request.cookies.has("token") ||
    request.cookies.has("petcarelog_session");

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!hasAuthToken && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
