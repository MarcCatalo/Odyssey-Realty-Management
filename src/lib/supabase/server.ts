import { createClient } from "@supabase/supabase-js";

import { getConfiguredEnvValue } from "@/lib/env";

export function createServerSupabaseClient() {
  const supabaseUrl = getConfiguredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseServiceRoleKey = getConfiguredEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
