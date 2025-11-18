import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicRoute, shouldSkipProxy } from "@/presentation/actions/auth/proxy-guards";

const ACCESS_TOKEN_COOKIE = "sb-access-token";
const REFRESH_TOKEN_COOKIE = "sb-refresh-token";

/**
 * proxy.ts
 * Acts as the network boundary for Next.js 16.
 * Keep logic minimal (optimistic redirects, lightweight rewrites).
 */
export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (shouldSkipProxy(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(accessToken && refreshToken);
  const isPublic = isPublicRoute(pathname);

  // Minimal redirect rules handled at the edge
  if (!isAuthenticated && !isPublic) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && pathname.startsWith("/auth") && pathname !== "/auth/logout") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-betlab-authenticated", isAuthenticated ? "1" : "0");
  response.headers.set("x-betlab-pathname", pathname);

  const locale = req.headers.get("accept-language");
  if (locale) {
    response.headers.set("x-betlab-locale", locale.split(",")[0]);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|android-icon|apple-icon).*)",
  ],
};
