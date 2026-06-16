import { getAdminSetupState } from "@/features/admin/auth";

export default function AdminLoginPage() {
  const setup = getAdminSetupState();

  return (
    <main className="px-5 py-10 md:px-10">
      <div className="brutal-panel reveal mx-auto max-w-3xl p-6">
        <p className="text-sm font-black text-grove">ADMIN LOGIN SETUP</p>
        <h1 className="mt-3 font-display text-5xl leading-none">Protected admin access</h1>
        <p className="mt-5 text-lg leading-8">
          The MVP should use Supabase Auth with an allowlisted sales-agent admin email. This page is
          the placeholder for the sign-in flow until Supabase project credentials are added.
        </p>

        <div className="mt-6 border-[3px] border-canopy bg-sprout p-4">
          <p className="font-black">Required environment variables</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>ADMIN_EMAIL_ALLOWLIST</li>
          </ul>
        </div>

        {setup.isConfigured ? (
          <p className="mt-6 border-[3px] border-canopy p-4 text-sm font-black">
            Config found. Next step: connect Supabase Auth UI and server-side admin session checks.
          </p>
        ) : (
          <p className="mt-6 border-[3px] border-canopy p-4 text-sm font-black">
            Missing config: {setup.missing.join(", ")}
          </p>
        )}
      </div>
    </main>
  );
}
