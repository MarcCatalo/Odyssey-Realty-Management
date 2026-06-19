import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  ShieldCheck
} from "lucide-react";

import { DeveloperProjectCard } from "@/components/developer-project-card";
import { salesAgent } from "@/features/catalog/data";
import type { Developer } from "@/features/catalog/types";
import { getProjectsForDeveloper, getPublishedDevelopers } from "@/features/catalog/queries";

export default function HomePage() {
  const developers = getPublishedDevelopers();
  const developerSpotlights = developers.slice(0, 3);
  const projectSnippets = developers
    .flatMap((developer) =>
      getProjectsForDeveloper(developer.slug).map((project) => ({
        developer,
        project
      }))
    )
    .slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-grid mx-auto max-w-7xl">
          <div className="home-hero-copy reveal">
            <h1>{salesAgent.headerMain}</h1>
            <p className="home-hero-kicker">{salesAgent.headerPrimarySubheader}</p>
            <p className="home-hero-description">
              {salesAgent.headerSecondarySubheader}
            </p>
          </div>

          <aside className="home-hero-aside">
            <div className="home-trust-card lift-card reveal reveal-delay-1">
              <ShieldCheck aria-hidden="true" className="h-8 w-8" />
              <h2>Information first</h2>
              <p>Public project details stay concise. Private sales documents stay outside the app.</p>
            </div>
            <div className="home-count-card lift-card reveal reveal-delay-2">
              <Building2 aria-hidden="true" className="h-8 w-8" />
              <p>{developers.length} published developers</p>
              <span>Default contact: {salesAgent.name}</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="home-section reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="home-section-heading">
            <h2>Developer spotlights</h2>
            <span aria-hidden="true" />
            <Link className="section-action-link interactive-card reveal reveal-delay-2" href="/developers">
              View all developers
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="home-developer-grid stagger-list">
            {developerSpotlights.map((developer) => (
              <HomeDeveloperCard developer={developer} key={developer.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section reveal reveal-delay-2 border-t-[3px] border-canopy px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="home-section-heading">
            <h2>Project previews</h2>
            <span aria-hidden="true" />
            <Link className="section-action-link interactive-card reveal reveal-delay-3" href="/gallery">
              Open gallery
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="profile-projects-grid stagger-list">
            {projectSnippets.map(({ developer, project }) => (
              <DeveloperProjectCard developerSlug={developer.slug} key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p>Listed agent</p>
            <h2>{salesAgent.name}</h2>
            <span>{salesAgent.title}</span>
          </div>
          <div className="home-footer-contact">
            {salesAgent.contactLinks.map((link) => (
              <a href={link.href} key={link.id} rel="noreferrer" target={link.href.startsWith("http") ? "_blank" : undefined}>
                {link.value}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

function HomeDeveloperCard({ developer }: { developer: Developer }) {
  const initials = developer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="home-developer-card interactive-card reveal scroll-reveal">
      <Link
        aria-label={`View developer profile for ${developer.name}`}
        className="group flex h-full flex-col focus:outline-none"
        href={`/developers/${developer.slug}`}
        prefetch
      >
        <div className="home-developer-media">
          <span>{initials}</span>
        </div>
        <div className="home-developer-body">
          <h3>{developer.name}</h3>
          <p>{developer.specialty}</p>
          <span>
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {developer.coverage}
          </span>
        </div>
      </Link>
    </article>
  );
}
