import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REALTOR_ACCESS_TOKEN_COOKIE } from "@/lib/realtor-auth-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/realtor/login" || pathname === "/api/realtor/auth/login") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/realtor") && !pathname.startsWith("/api/realtor")) {
    return NextResponse.next();
  }

  const hasRealtorSession = request.cookies.has(REALTOR_ACCESS_TOKEN_COOKIE);

  if (!hasRealtorSession) {
    if (pathname.startsWith("/api/realtor")) {
      return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/realtor/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/realtor/:path*", "/api/realtor/:path*"]
};
