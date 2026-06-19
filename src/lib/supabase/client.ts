import { createClient } from "@supabase/supabase-js";

import { getConfiguredEnvValue } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const supabaseUrl = getConfiguredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = getConfiguredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
