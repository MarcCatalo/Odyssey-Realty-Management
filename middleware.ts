import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REALTOR_ACCESS_TOKEN_COOKIE } from "@/lib/realtor-auth-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/realtor") || pathname === "/realtor/login") {
    return NextResponse.next();
  }

  const hasRealtorSession = request.cookies.has(REALTOR_ACCESS_TOKEN_COOKIE);

  if (!hasRealtorSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/realtor/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/realtor/:path*"]
};
