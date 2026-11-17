import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const session = request.cookies.get("petcarelog_session")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken || session);

  // 1. Unauthenticated requests to protected dashboards or admin console
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Route-based authorization: Admin Console
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (userRole && userRole !== "ADMIN") {
      // Non-admin attempting to access admin console -> send to role-specific dashboard
      const target = userRole === "PROVIDER" ? "/dashboard/provider" : "/dashboard/owner";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // 3. Route-based authorization: Provider Console
  if (pathname.startsWith("/dashboard/provider")) {
    if (userRole && userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard/owner", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
