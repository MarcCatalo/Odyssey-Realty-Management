import { NextResponse } from "next/server";

import { clearRealtorSessionCookies } from "@/lib/realtor-auth";

export async function POST() {
  clearRealtorSessionCookies();

  return NextResponse.json({ ok: true, redirectTo: "/realtor/login" });
}
