import Image from "next/image";
import {
  Building2,
  Calendar,
  ExternalLink,
  Home,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Send,
  ShieldCheck
} from "lucide-react";
import { notFound } from "next/navigation";

import { BreadcrumbBar } from "@/components/breadcrumb-bar";
import { ContactActions } from "@/components/contact-actions";
import { salesAgent } from "@/features/catalog/data";
import {
  getDeveloperBySlug,
  getProjectBySlugs,
  getProjectsForDeveloper,
  getPublicContactForProject,
  getPublishedDevelopers
} from "@/features/catalog/queries";

type ProjectDetailsPageProps = {
  params: {
    developerSlug: string;
    projectSlug: string;
  };
};

export function generateStaticParams() {
  return getPublishedDevelopers().flatMap((developer) =>
    getProjectsForDeveloper(developer.slug).map((project) => ({
      developerSlug: developer.slug,
      projectSlug: project.slug
    }))
  );
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const developer = getDeveloperBySlug(params.developerSlug);
  const project = getProjectBySlugs(params.developerSlug, params.projectSlug);

  if (!developer || !project) {
    notFound();
  }

  const salesContact = getPublicContactForProject(params.developerSlug, params.projectSlug);
  const gallery = project.gallery.length > 0 ? project.gallery : [project.coverImage];
  const galleryImages = [project.coverImage, ...project.gallery].slice(0, 3);
  const compactLocation = project.location.split(",")[0] ?? project.location;

  return (
    <>
      <BreadcrumbBar
        items={[
          { href: "/developers", label: "Developers" },
          { href: `/developers/${developer.slug}`, label: developer.name },
          { label: project.title }
        ]}
      />

      <section className="project-hero">
        <div className="project-hero-grid mx-auto max-w-7xl">
          <div className="project-hero-copy reveal">
            {project.statusLabel ? <p className="project-status-badge">{project.statusLabel}</p> : null}
            <h1 className="project-title">{project.title}</h1>
            <div className="project-meta-row">
              <span>By {developer.name}</span>
              <span>{project.location}</span>
              <span>{project.projectType}</span>
            </div>
            <p className="project-description">{project.description}</p>
          </div>
        </div>
      </section>

      <section className="project-stat-strip">
        <div className="project-stat-grid mx-auto max-w-7xl">
          <ProjectStat icon={Home} label="Total lots" value="34" />
          <ProjectStat icon={Layers} label="Levels" value="2" />
          <ProjectStat icon={Maximize2} label="Lot sizes" value="180-220 m²" />
          <ProjectStat icon={Calendar} label="Completion" value={project.statusLabel ?? "Contact sales" } />
          <ProjectStat icon={ShieldCheck} label="Approval" value="DA Approved" />
        </div>
      </section>

      <section className="project-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="House gallery" tag="Exterior & interior" />
          <div className="project-gallery-grid stagger-list">
            {galleryImages.map((image) => (
              <figure className="project-gallery-card interactive-card reveal scroll-reveal" key={image.id}>
                <div className="relative aspect-[4/3] bg-grove">
                  <Image
                    alt={image.alt}
                    className="card-media object-cover"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={image.src}
                  />
                </div>
                <figcaption className="border-t-[3px] border-canopy p-3 text-sm font-black">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section scroll-reveal border-t-[3px] border-canopy px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Site development plan" tag="SDP" />
          <div className="project-sdp-panel reveal">
            <div className="project-plan">
              <div className="project-plan-label">Site plan, {project.title}</div>
              <div className="project-plan-grid" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span className={index >= 4 && index <= 7 ? "project-plan-lot project-plan-lot-active" : "project-plan-lot"} key={index}>
                    {index + 101}
                  </span>
                ))}
              </div>
              <div className="project-plan-road">Road reserve</div>
              <div className="project-plan-legend">
                <span>Villa units</span>
                <span>Common area</span>
                <span>Road reserve</span>
              </div>
            </div>
            <aside className="project-plan-details">
              <p className="project-detail-kicker">Plan details</p>
              <PlanRow label="Total site area" value="6,240 m²" />
              <PlanRow label="No. of lots" value="34" />
              <PlanRow label="Road reserve" value="Included" />
              <PlanRow label="Common zones" value="2" />
              <PlanRow label="Zoning" value={project.projectType} />
              <PlanRow label="Reference" value={project.sdpImage.caption} />
              <p className="project-plan-note">
                SDP is provided for reference purposes. Contact agent for full plans and sales documentation.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="project-section scroll-reveal border-t-[3px] border-canopy px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Location" />
          <div className="project-location-grid">
            <div className="project-location-card reveal">
              <h2>42 {project.title} Drive, {project.location}</h2>
              <LocationItem icon={MapPin} label={project.location} />
              <LocationItem icon={Building2} label={`${compactLocation} station, 8 min walk`} />
              <LocationItem icon={Navigation} label={`${compactLocation} access, 5 min drive`} />
              <a
                className="project-map-button"
                href={project.googleMapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                <MapPin aria-hidden="true" className="h-4 w-4" />
                Open in Google Maps
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
            <div className="project-map-card reveal reveal-delay-1" aria-label={`${project.title} illustrative map`}>
              <div className="project-map-road project-map-road-a" />
              <div className="project-map-road project-map-road-b" />
              <div className="project-map-road project-map-road-c" />
              <div className="project-map-pin">
                <MapPin aria-hidden="true" className="h-5 w-5" />
                <span>{project.title}</span>
              </div>
              <p>{project.location}, map is illustrative only</p>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section scroll-reveal border-t-[3px] border-canopy px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Contact for this project" />
          <div className="project-contact-grid">
            <div className="project-agent-panel reveal">
              <p>Listing agent</p>
              <h2>{salesAgent.name}</h2>
              <span>{salesAgent.title}</span>
              <div className="project-agent-divider" />
              <ContactActions links={salesContact.links} />
            </div>
            <form className="project-enquiry-panel reveal reveal-delay-1">
              <p>Send an enquiry</p>
              <input aria-label="Your full name" placeholder="Your full name" />
              <input aria-label="Your email address" placeholder="Your email address" />
              <input aria-label="Your phone number" placeholder="Your phone number" />
              <textarea aria-label="Message" placeholder={`I would like to know more about ${project.title}.`} />
              <button type="button">
                <Send aria-hidden="true" className="h-4 w-4" />
                Send enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Home;
  label: string;
  value: string;
}) {
  return (
    <div className="project-stat-item reveal">
      <Icon aria-hidden="true" className="project-stat-icon" />
      <div>
        <p className="project-stat-value">{value}</p>
        <p className="project-stat-label">{label}</p>
      </div>
    </div>
  );
}

function SectionHeading({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="project-section-heading">
      <h2>{title}</h2>
      <span aria-hidden="true" />
      {tag ? <p>{tag}</p> : null}
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="project-plan-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LocationItem({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="project-location-item">
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
