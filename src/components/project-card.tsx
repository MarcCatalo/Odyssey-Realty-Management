import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { getProjectRoute } from "@/features/catalog/queries";
import type { Project } from "@/features/catalog/types";

export function ProjectCard({
  developerSlug,
  project
}: {
  developerSlug: string;
  project: Project;
}) {
  return (
    <article className="card-panel interactive-card reveal scroll-reveal overflow-hidden">
      <Link
        aria-label={`View details for ${project.title}`}
        className="group block focus:outline-none"
        href={getProjectRoute(developerSlug, project.slug)}
        prefetch
      >
        <div className="relative aspect-[4/3] border-b-[3px] border-canopy bg-grove">
          <Image
            alt={project.coverImage.alt}
            className="card-media object-cover"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            src={project.coverImage.src}
          />
          {project.statusLabel ? (
            <span className="card-accent absolute left-3 top-3 border-[3px] border-canopy bg-sprout px-2 py-1 text-xs font-black">
              {project.statusLabel}
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <p className="text-xs font-black text-grove">{project.projectType}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight">{project.title}</h3>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {project.location}
          </p>
          <p className="mt-3 text-sm leading-6">{project.description}</p>
          <div className="project-card-footer mt-4">
            <span>View project</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </article>
  );
}
