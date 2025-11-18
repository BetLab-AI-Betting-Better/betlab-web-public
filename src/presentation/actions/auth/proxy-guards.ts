const PUBLIC_ROUTES = [
  "/",
  "/match",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const STATIC_EXTENSIONS = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$/;

export const PROXY_MATCHER = [
  "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|android-icon|apple-icon).*)",
];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function shouldSkipProxy(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    STATIC_EXTENSIONS.test(pathname)
  );
}
