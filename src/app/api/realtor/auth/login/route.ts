import { NextResponse } from "next/server";
import { z } from "zod";

import { sanitizeLoginEmail, sanitizeLoginPassword } from "@/lib/login-sanitizer";
import { loginRealtor, normalizeFirstLoginCode } from "@/lib/realtor-auth";

const loginSchema = z.object({
  email: z.string().transform(sanitizeLoginEmail).pipe(z.string().email()),
  password: z.string().transform(sanitizeLoginPassword).pipe(z.string().min(1)),
  firstLoginCode: z
    .string()
    .optional()
    .transform((value) => (value ? normalizeFirstLoginCode(value) : undefined))
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
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
      return NextResponse.json(
        {
          message: result.message,
          requiresFirstLoginCode: result.requiresFirstLoginCode ?? false
        },
        { status: result.status }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        message: "The realtor portal could not complete sign in."
      },
      { status: 500 }
    );
  }
}
