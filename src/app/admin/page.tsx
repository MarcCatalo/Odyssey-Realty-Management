import Link from "next/link";
import { Building2, Images, Map, Phone, ShieldCheck } from "lucide-react";

import { getAdminSetupState } from "@/features/admin/auth";
import { developers, projects } from "@/features/catalog/data";

const cards = [
  {
    title: "Developers",
    value: `${developers.length} seeded`,
    description: "Manage developer profiles, cards, and developer-only contact details.",
    icon: Building2
  },
  {
    title: "Projects",
    value: `${projects.length} seeded`,
    description: "Manage project overview, status, price range, SDP, and location button data.",
    icon: Map
  },
  {
    title: "Images",
    value: "Supabase Storage",
    description: "Upload developer, project cover, house model, and SDP images.",
    icon: Images
  },
  {
    title: "Sales contact",
    value: "Default public CTA",
    description: "Manage the sales-agent contact source shown across project pages.",
    icon: Phone
  }
];

export default function AdminDashboardPage() {
  const setup = getAdminSetupState();

  return (
    <main className="px-5 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="brutal-panel reveal bg-bone p-6">
          <p className="text-sm font-black text-grove">ADMIN CMS FOUNDATION</p>
          <h1 className="mt-3 font-display text-5xl leading-none">Content command center</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8">
            This initial admin surface maps the CMS domains from the PRD. Write actions should be
            connected after Supabase Auth, allowlisted admin email, and RLS policies are configured.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="brutal-button px-5 py-3 text-sm" href="/admin/login">
              Configure login
            </Link>
            <Link className="brutal-link px-5 py-3 text-sm" href="/developers">
              Review public catalog
            </Link>
          </div>
        </section>

        <section className="stagger-list mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="brutal-panel reveal p-5" key={card.title}>
                <Icon aria-hidden="true" className="h-7 w-7" />
                <h2 className="mt-4 font-display text-2xl">{card.title}</h2>
                <p className="mt-2 inline-block border-2 border-canopy bg-sprout px-2 py-1 text-xs font-black">
                  {card.value}
                </p>
                <p className="mt-4 text-sm leading-6">{card.description}</p>
              </article>
            );
          })}
        </section>

        <section className="stagger-list mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="reveal border-[3px] border-canopy bg-canopy p-5 text-bone">
            <ShieldCheck aria-hidden="true" className="h-8 w-8 text-sprout" />
            <h2 className="mt-4 font-display text-3xl">Security posture</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              <li>No contractor or buyer accounts.</li>
              <li>Admin access is single-owner first, allowlist-ready later.</li>
              <li>No Google Drive or sales documentation is stored in the app.</li>
              <li>Public users can only read published catalog content.</li>
            </ul>
          </div>

          <div className="brutal-panel reveal p-5">
            <h2 className="font-display text-3xl">Environment status</h2>
            {setup.isConfigured ? (
              <p className="mt-4 border-[3px] border-canopy bg-sprout p-3 text-sm font-black">
                Supabase public config and admin allowlist are present.
              </p>
            ) : (
              <div className="mt-4">
                <p className="text-sm leading-6">
                  Add these variables before enabling real admin sign-in:
                </p>
                <ul className="mt-3 grid gap-2 text-sm font-black">
                  {setup.missing.map((key) => (
                    <li className="border-2 border-canopy px-3 py-2" key={key}>
                      {key}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
