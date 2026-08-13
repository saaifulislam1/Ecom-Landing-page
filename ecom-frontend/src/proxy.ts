import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "admin_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAdminToken = Boolean(request.cookies.get(ADMIN_TOKEN_COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (hasAdminToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !hasAdminToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
