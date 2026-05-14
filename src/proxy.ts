import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSafeReturnPath } from "@/lib/auth-redirect";

const PROTECTED_ROUTES = ["/dashboard", "/mypage", "/organizations", "/data", "/settings", "/users", "/boards", "/notices", "/inquiries", "/qna"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const token = request.cookies.get("access_token")?.value;

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
    const nextPath = getSafeReturnPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mypage/:path*",
    "/organizations/:path*",
    "/data/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/boards/:path*",
    "/notices/:path*",
    "/inquiries/:path*",
    "/qna/:path*",
    "/login",
  ],
};
