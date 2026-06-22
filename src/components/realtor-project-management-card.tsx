import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, MapPin } from "lucide-react";

import { RealtorDeleteButton } from "@/components/realtor-delete-button";
import type { Project } from "@/features/catalog/types";

export function RealtorProjectManagementCard({
  developerSlug,
  project
}: {
  developerSlug: string;
  project: Project;
}) {
  return (
    <article className="developer-project-card interactive-card reveal scroll-reveal">
      <Link
        aria-label={`Manage ${project.title}`}
        className="group flex h-full flex-col focus:outline-none"
        href={`/realtor/developers/${developerSlug}/projects/${project.slug}`}
        prefetch
      >
        <div className="developer-project-media">
          <Image
            alt={project.coverImage.alt}
            className="card-media object-cover"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            src={project.coverImage.src}
          />
          <div className="developer-project-media-scrim" />
          {project.statusLabel ? (
            <span className="developer-project-status">{project.statusLabel}</span>
          ) : null}
          <h3>{project.title}</h3>
        </div>

        <div className="developer-project-body">
          <div className="developer-project-facts">
            <p>
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {project.location}
            </p>
            <p>
              <Home aria-hidden="true" className="h-3.5 w-3.5" />
              {project.projectType}
            </p>
          </div>
        </div>

      </Link>
      <div className="developer-project-footer realtor-project-card-actions">
        <Link href={`/realtor/developers/${developerSlug}/projects/${project.slug}`}>
          <span>Manage project</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <RealtorDeleteButton
          developerSlug={developerSlug}
          itemName={project.title}
          kind="project"
          projectSlug={project.slug}
        />
      </div>
    </article>
  );
}
