import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Home, MapPin, Ruler, Save } from "lucide-react";

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

      <section className="realtor-dashboard-section px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="realtor-form-toolbar reveal">
            <Link className="realtor-text-button" href={`/realtor/developers/${developer.slug}`}>
              Back to developer
            </Link>
            <button className="realtor-save-button" type="button">
              <Save aria-hidden="true" className="h-4 w-4" />
              Save project
            </button>
          </div>

          <div className="realtor-form-grid">
            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Project details</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-field-grid">
                <label className="realtor-field">
                  <span>Project title</span>
                  <input defaultValue={project.title} type="text" />
                </label>
                <label className="realtor-field">
                  <span>Status label</span>
                  <input defaultValue={project.statusLabel ?? ""} type="text" />
                </label>
                <label className="realtor-field">
                  <span>Project type</span>
                  <input defaultValue={project.projectType} type="text" />
                </label>
                <label className="realtor-field">
                  <span>Location</span>
                  <input defaultValue={project.location} type="text" />
                </label>
              </div>

              <label className="realtor-field realtor-field-full">
                <span>Project description</span>
                <textarea defaultValue={project.description} rows={7} />
              </label>
            </section>

            <aside className="realtor-form-panel reveal reveal-delay-1 scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Project facts</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-publish-box">
                <MapPin aria-hidden="true" className="h-7 w-7" />
                <strong>{developer.name}</strong>
                <p>Developer owner for this project profile.</p>
              </div>

              <div className="realtor-detail-stack">
                <div className="realtor-detail-row">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  <span>Location button enabled</span>
                </div>
                <div className="realtor-detail-row">
                  <Ruler aria-hidden="true" className="h-4 w-4" />
                  <span>{project.gallery.length} gallery images</span>
                </div>
                <div className="realtor-detail-row">
                  <Home aria-hidden="true" className="h-4 w-4" />
                  <span>SDP image attached</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
