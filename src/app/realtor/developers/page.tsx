import Link from "next/link";
import { Archive, Building2, CheckCircle2, Eye, MapPin, Pencil, Plus, ShieldCheck } from "lucide-react";

import { developers, projects, salesAgent } from "@/features/catalog/data";
import type { Developer } from "@/features/catalog/types";

const developerLimit = 10;
const draftDevelopers = developers.filter((developer) => developer.status === "draft");

export default function RealtorDevelopersPage({
  searchParams
}: {
  searchParams?: {
    deleted?: string;
  };
}) {
  const deletedSlug = searchParams?.deleted;
  const visibleDevelopers = deletedSlug
    ? developers.filter((developer) => developer.slug !== deletedSlug)
    : developers;
  const visiblePublishedDevelopers = visibleDevelopers.filter(
    (developer) => developer.status === "published"
  );
  const canAddDeveloper = visiblePublishedDevelopers.length < developerLimit;

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Developer management</p>
            <h1>Developer grid</h1>
            <p>
              Review published developers, update profile details, archive inactive partners, and add
              a new developer when your subscription limit allows it.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card realtor-limit-card">
              <Building2 aria-hidden="true" className="h-8 w-8" />
              <h2>
                {visiblePublishedDevelopers.length} / {developerLimit} developers
              </h2>
              <p>Current subscription allowance for published developer profiles.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="realtor-stat-strip">
        <div className="realtor-stat-grid mx-auto max-w-7xl">
          <ManagementStat
            icon={ShieldCheck}
            label="Published"
            value={`${visiblePublishedDevelopers.length}`}
          />
          <ManagementStat icon={Pencil} label="Draft profiles" value={`${draftDevelopers.length}`} />
          <ManagementStat icon={Building2} label="Published projects" value={`${projects.length}`} />
          <ManagementStat icon={CheckCircle2} label="Default contact" value={salesAgent.name} />
        </div>
      </section>

      <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="realtor-section-heading">
            <h2>Published developers</h2>
            <span aria-hidden="true" />
          </div>

          <div className="realtor-management-grid stagger-list">
            {visibleDevelopers.map((developer) => (
              <DeveloperManagementCard developer={developer} key={developer.id} />
            ))}

            <Link
              className="realtor-add-card interactive-card reveal scroll-reveal"
              href="/realtor/developers/new"
              aria-disabled={!canAddDeveloper}
              prefetch
            >
              <div className="realtor-add-icon">
                <Plus aria-hidden="true" className="h-12 w-12" />
              </div>
              <h3>Add new developer</h3>
              <p>
                {canAddDeveloper
                  ? "Create a new developer profile for the public catalog."
                  : "Developer limit reached under the current plan."}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DeveloperManagementCard({ developer }: { developer: Developer }) {
  const developerProjects = projects.filter((project) => project.developerId === developer.id);
  const initials = developer.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="realtor-management-card interactive-card reveal scroll-reveal">
      <Link
        aria-label={`Manage ${developer.name}`}
        className="realtor-management-main focus:outline-none"
        href={`/realtor/developers/${developer.slug}`}
        prefetch
      >
        <div className="realtor-management-media">
          <span>{initials}</span>
          <strong>{developer.status}</strong>
        </div>
        <div className="realtor-management-body">
          <p className="realtor-management-specialty">{developer.specialty}</p>
          <h3>{developer.name}</h3>
          <span>
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {developer.coverage}
          </span>
          <p>{developer.description}</p>
        </div>
      </Link>

      <div className="realtor-management-meta">
        <div>
          <strong>{developerProjects.length}</strong>
          <span>Projects</span>
        </div>
      </div>

      <div className="realtor-management-actions" aria-label={`${developer.name} actions`}>
        <Link href={`/developers/${developer.slug}`} target="_blank">
          <Eye aria-hidden="true" className="h-4 w-4" />
          Preview
        </Link>
        <Link href={`/realtor/developers/${developer.slug}`}>
          <Pencil aria-hidden="true" className="h-4 w-4" />
          Manage
        </Link>
        <button type="button">
          <Archive aria-hidden="true" className="h-4 w-4" />
          Archive
        </button>
      </div>
    </article>
  );
}

function ManagementStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="realtor-stat-item reveal">
      <Icon aria-hidden="true" className="realtor-stat-icon" />
      <div>
        <p className="realtor-stat-value">{value}</p>
        <p className="realtor-stat-label">{label}</p>
      </div>
    </div>
  );
}
