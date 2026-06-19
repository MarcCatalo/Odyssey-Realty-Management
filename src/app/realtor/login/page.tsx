import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { RealtorLoginForm } from "@/components/realtor-login-form";

export default function RealtorLoginPage() {
  return (
    <main className="realtor-login-page">
      <section className="realtor-login-shell reveal">
        <div className="realtor-login-brand">
          <Link href="/" className="font-display text-3xl font-black uppercase leading-[0.9]">
            Meridian
            <br />
            CMS
          </Link>
          <p>Realtor-managed catalog access</p>
        </div>

        <div className="realtor-login-panel">
          <p className="realtor-login-eyebrow">Realtor portal</p>
          <h1>Sign in to manage your catalog</h1>
          <p className="realtor-login-copy">
            Use the account provided by the platform owner. Public visitors do not need accounts.
          </p>

          <RealtorLoginForm />

          <div className="realtor-login-note">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            <p>No signup is available. Realtor accounts are issued by the platform owner.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
