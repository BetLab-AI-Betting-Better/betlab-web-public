import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldSkipProxy } from "@/presentation/actions/auth/proxy-guards";

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

  const response = NextResponse.next();
  response.headers.set("x-betlab-authenticated", "0");
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
