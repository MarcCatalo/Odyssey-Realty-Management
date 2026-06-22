import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

import { getDeveloperRoute } from "@/features/catalog/queries";
import type { Developer } from "@/features/catalog/types";

export function DeveloperCard({ developer }: { developer: Developer }) {
  const initials = developer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="public-developer-card interactive-card reveal scroll-reveal">
      <Link
        aria-label={`View developer profile for ${developer.name}`}
        className="group flex h-full flex-col focus:outline-none"
        href={getDeveloperRoute(developer.slug)}
        prefetch
      >
        <div className="public-developer-card-media">
          <div className="public-developer-card-initials">
            {developer.logoImage ? (
              <Image
                alt={developer.logoImage.alt}
                className="object-contain"
                fill
                sizes="5rem"
                src={developer.logoImage.src}
                unoptimized
              />
            ) : (
              initials
            )}
          </div>
          <span className="public-developer-card-count">
            {developer.projectCount} Projects
          </span>
        </div>
        <div className="public-developer-card-body">
          <p className="public-developer-card-specialty">{developer.specialty}</p>
          <h3>{developer.name}</h3>
          <p className="public-developer-card-location">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {developer.coverage}
          </p>
          <p className="public-developer-card-description">{developer.description}</p>
        </div>
        <div className="public-developer-card-footer">
          <span>View developer</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </div>
      </Link>
    </article>
  );
}
