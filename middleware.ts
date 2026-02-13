import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = ["/dfdfdf"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = ADMIN_PREFIX.some((p) => pathname.startsWith(p));
  if (!isAdminRoute) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;

  // not logged in → go to sign-in
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/app-users/:path*", "/tickets/:path*", "/settings/:path*"],
};
