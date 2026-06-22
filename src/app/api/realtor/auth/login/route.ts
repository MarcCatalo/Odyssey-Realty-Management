import { NextResponse } from "next/server";
import { z } from "zod";

import { sanitizeLoginEmail, sanitizeLoginPassword } from "@/lib/login-sanitizer";
import { loginRealtor, normalizeFirstLoginCode } from "@/lib/realtor-auth";
import { logInfo, logWarn } from "@/server/logger";

const loginSchema = z.object({
  email: z.string().transform(sanitizeLoginEmail).pipe(z.string().email()),
  password: z.string().transform(sanitizeLoginPassword).pipe(z.string().min(1)),
  firstLoginCode: z
    .string()
    .optional()
    .transform((value) => (value ? normalizeFirstLoginCode(value) : undefined))
});

export async function POST(request: Request) {
  const startedAt = Date.now();
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    logWarn("realtor.auth.login_invalid_payload", {
      durationMs: Date.now() - startedAt,
      status: 400
    });

    return NextResponse.json(
      {
        message: "Enter a valid email address and password."
      },
      { status: 400 }
    );
  }

  try {
    const result = await loginRealtor(parsed.data);

    if (!result.ok) {
      logWarn("realtor.auth.login_failed", {
        durationMs: Date.now() - startedAt,
        requiresFirstLoginCode: result.requiresFirstLoginCode ?? false,
        status: result.status
      });

      return NextResponse.json(
        {
          message: result.message,
          requiresFirstLoginCode: result.requiresFirstLoginCode ?? false
        },
        { status: result.status }
      );
    }

    logInfo("realtor.auth.login_success", {
      durationMs: Date.now() - startedAt
    });

    return NextResponse.json(result);
  } catch {
    logWarn("realtor.auth.login_error", {
      durationMs: Date.now() - startedAt,
      status: 500
    });

    return NextResponse.json(
      {
        message: "The realtor portal could not complete sign in."
      },
      { status: 500 }
    );
  }
}
