import { createHash, randomBytes, timingSafeEqual } from "crypto";

import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  REALTOR_ACCESS_TOKEN_COOKIE,
  REALTOR_REFRESH_TOKEN_COOKIE
} from "@/lib/realtor-auth-constants";

const ACTIVE_SUBSCRIPTION_STATUSES = ["trial", "active", "past_due"] as const;

type ActiveSubscription = {
  id: string;
  realtor_id: string;
  first_login_code_hash: string | null;
  first_login_verified_at: string | null;
};

export type RealtorLoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; status: number; message: string; requiresFirstLoginCode?: boolean };

export function generateFirstLoginCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function hashFirstLoginCode(code: string, subscriptionId: string) {
  const pepper = process.env.FIRST_LOGIN_CODE_PEPPER;

  if (!pepper) {
    throw new Error("FIRST_LOGIN_CODE_PEPPER is required for first-login code hashing.");
  }

  return createHash("sha256")
    .update(`${pepper}:${subscriptionId}:${normalizeFirstLoginCode(code)}`)
    .digest("hex");
}

export function verifyFirstLoginCode(code: string, expectedHash: string, subscriptionId: string) {
  const actualHash = hashFirstLoginCode(code, subscriptionId);
  const actual = Buffer.from(actualHash, "hex");
  const expected = Buffer.from(expectedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function normalizeFirstLoginCode(code: string) {
  return code.replace(/\s+/g, "").toUpperCase();
}

export async function loginRealtor({
  email,
  password,
  firstLoginCode
}: {
  email: string;
  password: string;
  firstLoginCode?: string;
}): Promise<RealtorLoginResult> {
  const authClient = createBrowserSupabaseClient();
  const adminClient = createServerSupabaseClient();

  if (!authClient || !adminClient) {
    return {
      ok: false,
      status: 503,
      message: "Realtor login is not configured yet."
    };
  }

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session || !data.user) {
    if (error && !isInvalidCredentialsError(error.message)) {
      return {
        ok: false,
        status: 503,
        message: "Realtor login is not configured correctly yet."
      };
    }

    return {
      ok: false,
      status: 401,
      message: "Email or password is incorrect."
    };
  }

  const realtor = await getRealtorByUserId(data.user, adminClient);

  if (!realtor) {
    return {
      ok: false,
      status: 403,
      message: "This account is not connected to an active realtor profile."
    };
  }

  const subscription = await getActiveSubscription(realtor.id, adminClient);

  if (!subscription) {
    return {
      ok: false,
      status: 403,
      message: "This realtor account does not have an active subscription."
    };
  }

  if (subscription.first_login_code_hash && !subscription.first_login_verified_at) {
    if (!firstLoginCode) {
      return {
        ok: false,
        status: 401,
        message: "Enter the first-time login code provided by the platform owner.",
        requiresFirstLoginCode: true
      };
    }

    const isValidCode = verifyFirstLoginCode(
      firstLoginCode,
      subscription.first_login_code_hash,
      subscription.id
    );

    if (!isValidCode) {
      return {
        ok: false,
        status: 401,
        message: "The first-time login code is incorrect.",
        requiresFirstLoginCode: true
      };
    }

    const { error: updateError } = await adminClient
      .from("realtor_subscriptions")
      .update({ first_login_verified_at: new Date().toISOString() })
      .eq("id", subscription.id);

    if (updateError) {
      return {
        ok: false,
        status: 500,
        message: "The first-time login code could not be confirmed."
      };
    }
  }

  setRealtorSessionCookies(data.session.access_token, data.session.refresh_token, data.session.expires_in);

  return {
    ok: true,
    redirectTo: "/realtor"
  };
}

function isInvalidCredentialsError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("email not confirmed")
  );
}

export function clearRealtorSessionCookies() {
  const cookieStore = cookies();

  cookieStore.delete(REALTOR_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REALTOR_REFRESH_TOKEN_COOKIE);
}

function setRealtorSessionCookies(accessToken: string, refreshToken: string, maxAge: number) {
  const cookieStore = cookies();
  const secure = process.env.NODE_ENV === "production";
  const sharedOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/"
  };

  cookieStore.set(REALTOR_ACCESS_TOKEN_COOKIE, accessToken, {
    ...sharedOptions,
    maxAge
  });

  cookieStore.set(REALTOR_REFRESH_TOKEN_COOKIE, refreshToken, {
    ...sharedOptions,
    maxAge: 60 * 60 * 24 * 30
  });
}

async function getRealtorByUserId(user: User, adminClient: NonNullable<ReturnType<typeof createServerSupabaseClient>>) {
  const { data, error } = await adminClient
    .from("realtors")
    .select("id,status")
    .eq("auth_user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

async function getActiveSubscription(
  realtorId: string,
  adminClient: NonNullable<ReturnType<typeof createServerSupabaseClient>>
): Promise<ActiveSubscription | null> {
  const { data, error } = await adminClient
    .from("realtor_subscriptions")
    .select("id,realtor_id,first_login_code_hash,first_login_verified_at")
    .eq("realtor_id", realtorId)
    .in("status", ACTIVE_SUBSCRIPTION_STATUSES)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
