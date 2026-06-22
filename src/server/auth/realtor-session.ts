import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { REALTOR_ACCESS_TOKEN_COOKIE } from "@/lib/realtor-auth-constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppError } from "@/server/errors";
import type { SubscriptionLimits } from "@/server/services/subscription-limits";

export type RealtorContext = {
  realtorId: string;
  authUserId: string;
  limits: SubscriptionLimits;
};

type SubscriptionRow = {
  developer_limit_override: number | null;
  project_limit_override: number | null;
  project_image_limit_override: number | null;
  subscription_plans: {
    developer_limit: number;
    project_limit_per_developer: number;
    project_image_limit: number;
  } | null;
};

export async function getRealtorContext(): Promise<RealtorContext> {
  const accessToken = cookies().get(REALTOR_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    throw new AppError("Sign in to continue.", 401);
  }

  const authClient = createBrowserSupabaseClient();
  const adminClient = createServerSupabaseClient();

  if (!authClient || !adminClient) {
    throw new AppError("Supabase is not configured for server requests.", 503);
  }

  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

  if (userError || !userData.user) {
    throw new AppError("Your session could not be verified. Please sign in again.", 401);
  }

  const { data: realtor, error: realtorError } = await adminClient
    .from("realtors")
    .select("id,auth_user_id")
    .eq("auth_user_id", userData.user.id)
    .eq("status", "active")
    .maybeSingle();

  if (realtorError || !realtor) {
    throw new AppError("This account is not connected to an active realtor profile.", 403);
  }

  const { data: subscription, error: subscriptionError } = await adminClient
    .from("realtor_subscriptions")
    .select(
      "developer_limit_override,project_limit_override,project_image_limit_override,subscription_plans(developer_limit,project_limit_per_developer,project_image_limit)"
    )
    .eq("realtor_id", realtor.id)
    .in("status", ["trial", "active", "past_due"])
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  if (subscriptionError || !subscription?.subscription_plans) {
    throw new AppError("This realtor account does not have an active subscription.", 403);
  }

  return {
    realtorId: realtor.id,
    authUserId: realtor.auth_user_id,
    limits: {
      developerLimit:
        subscription.developer_limit_override ?? subscription.subscription_plans.developer_limit,
      projectLimitPerDeveloper:
        subscription.project_limit_override ?? subscription.subscription_plans.project_limit_per_developer,
      projectImageLimit:
        subscription.project_image_limit_override ?? subscription.subscription_plans.project_image_limit
    }
  };
}

export async function requireRealtorContextForPage(): Promise<RealtorContext> {
  try {
    return await getRealtorContext();
  } catch (error) {
    if (error instanceof AppError && error.status === 401) {
      redirect("/realtor/login");
    }

    throw error;
  }
}
