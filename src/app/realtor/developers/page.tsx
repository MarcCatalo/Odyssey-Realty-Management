import Link from "next/link";
import Image from "next/image";
import { Building2, CheckCircle2, Eye, MapPin, Pencil, Plus, ShieldCheck } from "lucide-react";

import { RealtorDeleteButton } from "@/components/realtor-delete-button";
import { getCatalogForRealtorId, getRealtorSubscriptionLimits } from "@/features/catalog/live-queries";
import type { Developer } from "@/features/catalog/types";
import { requireRealtorContextForPage } from "@/server/auth/realtor-session";

export const dynamic = "force-dynamic";

export default async function RealtorDevelopersPage({
  searchParams
}: {
  searchParams?: {
    deleted?: string;
  };
}) {
  const context = await requireRealtorContextForPage();
  const [catalog, limits] = await Promise.all([
    getCatalogForRealtorId(context.realtorId),
    getRealtorSubscriptionLimits(context.realtorId)
  ]);
  const developers = catalog.developers;
  const projects = catalog.projects;
  const draftDevelopers = developers.filter((developer) => developer.status === "draft");
  const deletedSlug = searchParams?.deleted;
  const visibleDevelopers = deletedSlug
    ? developers.filter((developer) => developer.slug !== deletedSlug)
    : developers;
  const visiblePublishedDevelopers = visibleDevelopers.filter(
    (developer) => developer.status === "published"
  );
  const canAddDeveloper = visibleDevelopers.length < limits.developerLimit;

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Developer management</p>
            <h1>Developer grid</h1>
            <p>
              Review published developers, update profile details, delete inactive partners, and add
              a new developer when your subscription limit allows it.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card realtor-limit-card">
              <Building2 aria-hidden="true" className="h-8 w-8" />
              <h2>
                {visibleDevelopers.length} / {limits.developerLimit} developers
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
          <ManagementStat icon={CheckCircle2} label="Default contact" value={catalog.salesAgent.name} />
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
              <DeveloperManagementCard developer={developer} key={developer.id} projects={projects} />
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

function DeveloperManagementCard({ developer, projects }: { developer: Developer; projects: { developerId: string }[] }) {
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
          <div className="realtor-management-logo-mark">
            {developer.logoImage ? (
              <Image
                alt={developer.logoImage.alt}
                className="object-contain"
                fill
                sizes="4.75rem"
                src={developer.logoImage.src}
                unoptimized
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
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
        <RealtorDeleteButton developerSlug={developer.slug} itemName={developer.name} kind="developer" />
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
