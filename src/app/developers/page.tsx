import { Building2 } from "lucide-react";

import { DeveloperCard } from "@/components/developer-card";
import { PageHero } from "@/components/page-hero";
import { salesAgent } from "@/features/catalog/data";
import { getPublishedDevelopers } from "@/features/catalog/queries";

export default function DevelopersPage() {
  const developers = getPublishedDevelopers();

  return (
    <>
      <PageHero
        description="Start with the developer list, then open a profile to see their available projects and public project details."
        eyebrow="Developer directory"
        title="Developers"
      >
        <div className="home-count-card lift-card">
          <Building2 aria-hidden="true" className="h-8 w-8" />
          <p>{developers.length} published developers</p>
          <span>Default contact: {salesAgent.name}</span>
        </div>
      </PageHero>

      <section className="reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="stagger-list mx-auto grid max-w-7xl gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {developers.map((developer) => (
            <DeveloperCard developer={developer} key={developer.id} />
          ))}
        </div>
      </section>
    </>
  );
}
