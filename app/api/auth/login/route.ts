import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body;

  // TODO: replace with your backend auth check
  if (email !== "admin@79er.com" || password !== "admin123") {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  // set cookie (httpOnly)
  res.cookies.set("admin_token", "demo_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
