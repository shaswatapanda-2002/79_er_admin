import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_token";
const DEFAULT_AFTER_LOGIN = "/dashboard";

// Auth pages
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

// Protected admin routes
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/app-users",
  "/agencies",
  "/subscriptions",
  "/payments",
  "/analytics",
  "/settings",
];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const isLoggedIn = !!token;

  // ✅ If already logged in, block sign-in/sign-up and go to dashboard
  if (isAuthRoute(pathname) && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = DEFAULT_AFTER_LOGIN;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ If NOT logged in:
  // - allow access to sign-in/sign-up (NO LOOP)
  // - block only protected routes
  if (!isLoggedIn) {
    if (isAuthRoute(pathname)) {
      return NextResponse.next();
    }

    if (isProtectedRoute(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // any other public route
    return NextResponse.next();
  }

  // ✅ Logged in => allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // protected
    "/dashboard/:path*",
    "/app-users/:path*",
    "/agencies/:path*",
    "/subscriptions/:path*",
    "/payments/:path*",
    "/analytics/:path*",
    "/settings/:path*",

    // auth pages (only to redirect logged-in users away)
    "/sign-in",
    "/sign-up",
  ],
};