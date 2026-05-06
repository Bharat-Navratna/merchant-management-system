import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/merchants", "/kyb", "/webhooks", "/security"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/merchants/:path*", "/kyb/:path*", "/webhooks/:path*", "/security/:path*", "/login"],
};
