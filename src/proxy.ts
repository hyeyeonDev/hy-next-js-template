import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSafeReturnPath } from "@/lib/auth-redirect";
import { isRouteFeatureEnabled } from "@/lib/feature-flags";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/logout", "/find-id", "/find-password", "/storybook", "/error-preview", "/not-found"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/storybook", request.url));
  }

  if (!isRouteFeatureEnabled(pathname)) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }

  const isProtected = !isPublicRoute(pathname);
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
