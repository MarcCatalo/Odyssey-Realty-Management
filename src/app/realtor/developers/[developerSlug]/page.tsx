import { notFound } from "next/navigation";
import { Eye } from "lucide-react";

import { RealtorDeveloperEditor } from "@/components/realtor-developer-editor";
import { getCatalogForRealtorId } from "@/features/catalog/live-queries";
import { requireRealtorContextForPage } from "@/server/auth/realtor-session";

type RealtorDeveloperEditPageProps = {
  params: {
    developerSlug: string;
  };
};

export const dynamic = "force-dynamic";

export default async function RealtorDeveloperEditPage({ params }: RealtorDeveloperEditPageProps) {
  const context = await requireRealtorContextForPage();
  const catalog = await getCatalogForRealtorId(context.realtorId);
  const developer = catalog.developers.find((item) => item.slug === params.developerSlug);

  if (!developer) {
    notFound();
  }

  const developerProjects = catalog.projects.filter((project) => project.developerId === developer.id);

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Manage developer</p>
            <h1>{developer.name}</h1>
            <p>
              Update the public profile details, developer-only contact references, and publishing state
              for this developer.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card realtor-status-card-accent">
              <Eye aria-hidden="true" className="h-8 w-8" />
              <h2>{developer.status} profile</h2>
              <p>{developerProjects.length} projects are currently connected to this developer.</p>
            </div>
          </aside>
        </div>
      </section>

      <RealtorDeveloperEditor developer={developer} developerProjects={developerProjects} />
    </>
  );
}
