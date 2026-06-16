import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck
} from "lucide-react";

import { BreadcrumbBar } from "@/components/breadcrumb-bar";
import { ContactActions } from "@/components/contact-actions";
import { DeveloperProjectCard } from "@/components/developer-project-card";
import { salesAgent } from "@/features/catalog/data";
import {
  getDeveloperBySlug,
  getDeveloperContact,
  getProjectsForDeveloper,
  getPublishedDevelopers
} from "@/features/catalog/queries";

type DeveloperProfilePageProps = {
  params: {
    developerSlug: string;
  };
};

export function generateStaticParams() {
  return getPublishedDevelopers().map((developer) => ({
    developerSlug: developer.slug
  }));
}

export default function DeveloperProfilePage({ params }: DeveloperProfilePageProps) {
  const developer = getDeveloperBySlug(params.developerSlug);

  if (!developer) {
    notFound();
  }

  const projects = getProjectsForDeveloper(params.developerSlug);
  const developerContact = getDeveloperContact(params.developerSlug);
  const phoneLink = salesAgent.contactLinks.find((link) => link.type === "phone");
  const emailLink = salesAgent.contactLinks.find((link) => link.type === "email");
  const heroCategory = developer.specialty.toLowerCase().includes("house")
    ? "Residential developer"
    : developer.specialty;
  const primaryCoverage = developer.coverage.split(",")[0] ?? developer.coverage;
  const initials = developer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <BreadcrumbBar
        items={[
          { href: "/developers", label: "Developers" },
          { label: developer.name }
        ]}
      />

      <section className="profile-hero">
        <div className="mx-auto max-w-7xl">
          <div className="profile-template-hero-grid">
            <div className="profile-template-copy reveal">
            <div className="profile-title-row">
              <div className="profile-mark">{initials}</div>
              <div>
                <p className="profile-eyebrow">{heroCategory}</p>
                <h1 className="profile-title">{developer.name}</h1>
              </div>
            </div>
            <p className="profile-description">{developer.description}</p>
          </div>

            <aside className="profile-template-actions reveal reveal-delay-1">
              <div className="profile-action-row">
                {emailLink ? (
                  <a className="profile-action-primary" href={emailLink.href}>
                    <Mail aria-hidden="true" className="h-4 w-4" />
                    Contact agent
                  </a>
                ) : null}
                {phoneLink ? (
                  <a className="profile-action-secondary" href={phoneLink.href}>
                    <Phone aria-hidden="true" className="h-4 w-4" />
                    Call agent
                  </a>
                ) : null}
              </div>
              <div className="profile-social-row">
                <span>@{developer.slug.replace(/-/g, "_").toUpperCase()}</span>
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="profile-stat-strip">
        <div className="profile-stat-grid mx-auto max-w-7xl">
          <ProfileStat icon={Building2} label="Projects listed" value={`${projects.length}`} />
          <ProfileStat icon={MapPin} label="Primary coverage" value={primaryCoverage} />
          <ProfileStat icon={ShieldCheck} label="Catalog status" value="Verified" />
          <ProfileStat icon={Calendar} label="Member since" value="2019" />
        </div>
      </section>

      <section className="profile-details-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="profile-section-heading">
            <h2>Developer details</h2>
            <span aria-hidden="true" />
          </div>

          <div className="profile-details-grid stagger-list">
            <div className="profile-detail-panel reveal">
              <DetailRow label="Coverage" value={developer.coverage} />
              <DetailRow label="Headquarters" value={developer.coverage} />
              <DetailRow label="Contact source" value={developerContact?.links[0]?.value ?? "On request"} />
              <DetailRow label="License" value="Verified developer partner" />
            </div>

            <div className="profile-detail-panel reveal">
              <p className="profile-detail-kicker">About</p>
              <p className="profile-about-copy">
                {developer.name} is listed in this sales-agent managed catalog for buyers comparing
                developer-backed homes and project locations. Profile information focuses on public
                buyer-facing details, available projects, and the best contact path for inquiries.
              </p>
              <div className="profile-detail-links">
                {developerContact?.links.length ? (
                  <ContactActions compact links={developerContact.links} />
                ) : (
                  <span>Developer contact available through sales agent.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-projects-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="profile-projects-heading">
            <h2>Recent projects</h2>
            <span aria-hidden="true" />
            <p>Available</p>
          </div>
          <div className="profile-projects-grid stagger-list">
            {projects.map((project) => (
              <DeveloperProjectCard developerSlug={developer.slug} key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="profile-stat-item reveal">
      <Icon aria-hidden="true" className="profile-stat-icon" />
      <div>
        <p className="profile-stat-value">{value}</p>
        <p className="profile-stat-label">{label}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-detail-row">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
