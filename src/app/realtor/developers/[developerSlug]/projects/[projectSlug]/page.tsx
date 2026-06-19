import { notFound } from "next/navigation";
import { Home } from "lucide-react";

import { RealtorProjectEditor } from "@/components/realtor-project-editor";
import { developers, projects } from "@/features/catalog/data";

type RealtorProjectEditorPageProps = {
  params: {
    developerSlug: string;
    projectSlug: string;
  };
};

export default function RealtorProjectEditorPage({ params }: RealtorProjectEditorPageProps) {
  const developer = developers.find((item) => item.slug === params.developerSlug);
  const project = projects.find(
    (item) => item.slug === params.projectSlug && item.developerId === developer?.id
  );

  if (!developer || !project) {
    notFound();
  }

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Manage project</p>
            <h1>{project.title}</h1>
            <p>
              Update public-facing project details, status labels, coverage notes, and the location path
              tied to {developer.name}.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card realtor-status-card-accent">
              <Home aria-hidden="true" className="h-8 w-8" />
              <h2>{project.statusLabel ?? "Published project"}</h2>
              <p>{project.projectType}</p>
            </div>
          </aside>
        </div>
      </section>

      <RealtorProjectEditor developer={developer} project={project} />
    </>
  );
}
