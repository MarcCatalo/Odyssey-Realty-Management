export type AdminSetupState = {
  isConfigured: boolean;
  missing: string[];
  allowlistedEmails: string[];
};

export function getAdminSetupState(): AdminSetupState {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ADMIN_EMAIL_ALLOWLIST: process.env.ADMIN_EMAIL_ALLOWLIST
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    isConfigured: missing.length === 0,
    missing,
    allowlistedEmails:
      process.env.ADMIN_EMAIL_ALLOWLIST?.split(",")
        .map((email) => email.trim())
        .filter(Boolean) ?? []
  };
}
