import Link from "next/link";

import { getAdminSetupState } from "@/features/admin/auth";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const setup = getAdminSetupState();

  return (
    <div className="min-h-screen bg-bone text-canopy">
      <header className="border-b-[3px] border-canopy bg-canopy px-5 py-4 text-bone">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <Link className="font-display text-2xl font-black" href="/admin">
            MERIDIAN ADMIN
          </Link>
          <nav className="flex flex-wrap gap-2 text-xs font-black">
            <Link className="border-2 border-bone px-3 py-2 hover:bg-bone hover:text-canopy" href="/">
              Public site
            </Link>
            <Link
              className="border-2 border-bone px-3 py-2 hover:bg-bone hover:text-canopy"
              href="/admin/login"
            >
              Login setup
            </Link>
          </nav>
        </div>
      </header>

      {!setup.isConfigured ? (
        <div className="border-b-[3px] border-canopy bg-sprout px-5 py-3 text-sm font-black">
          Admin auth is not fully configured. Missing: {setup.missing.join(", ")}
        </div>
      ) : null}

      {children}
    </div>
  );
}
