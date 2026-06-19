"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Eye,
  Home,
  MapPin,
  Pencil,
  Ruler,
  Save,
  Trash2
} from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";
import { developers } from "@/features/catalog/data";
import type { Developer, Project } from "@/features/catalog/types";

type RealtorProjectEditorProps = {
  developer: Developer;
  project: Project;
};

export function RealtorProjectEditor({ developer, project }: RealtorProjectEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!showSavedToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSavedToast(false);
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [showSavedToast]);

  function handleSave() {
    setIsEditing(false);
    setShowSavedToast(true);
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    router.push(`/realtor/developers/${developer.slug}?projectDeleted=${project.slug}`);
  }

  return (
    <section className="realtor-dashboard-section px-5 py-10 md:px-10">
      {showDeleteModal ? (
        <div className="realtor-confirm-overlay" role="presentation">
          <div
            aria-describedby="delete-project-description"
            aria-modal="true"
            className="realtor-confirm-modal"
            role="dialog"
          >
            <AlertTriangle aria-hidden="true" className="h-8 w-8 text-[#b3261e]" />
            <h2>Delete project?</h2>
            <p id="delete-project-description">
              This will remove {project.title} from {developer.name}. Do you want to continue?
            </p>
            <div className="realtor-confirm-actions">
              <button className="realtor-text-button" onClick={() => setShowDeleteModal(false)} type="button">
                Cancel
              </button>
              <button className="realtor-danger-button" onClick={handleDeleteConfirm} type="button">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Delete project
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl">
        <div className="realtor-form-toolbar reveal">
          <Link className="realtor-text-button" href={`/realtor/developers/${developer.slug}`}>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to developer
          </Link>
          <div className="realtor-toolbar-actions">
            {showSavedToast ? (
              <div aria-live="polite" className="realtor-feedback-toast">
                <span>Edits have been saved.</span>
              </div>
            ) : null}
            <Link
              className="realtor-text-button"
              href={`/developers/${developer.slug}/projects/${project.slug}`}
              target="_blank"
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </Link>
            <button className="realtor-text-button" onClick={() => setIsEditing(true)} type="button">
              <Pencil aria-hidden="true" className="h-4 w-4" />
              Edit project
            </button>
            {isEditing ? (
              <button className="realtor-save-button" onClick={handleSave} type="button">
                <Save aria-hidden="true" className="h-4 w-4" />
                Save changes
              </button>
            ) : null}
            <button className="realtor-danger-button" onClick={() => setShowDeleteModal(true)} type="button">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete project
            </button>
          </div>
        </div>

        <div className="realtor-form-grid">
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project details</h2>
              <span aria-hidden="true" />
            </div>

            <label className="realtor-field realtor-field-full realtor-field-start realtor-field-contained">
              <span>Publish under developer</span>
              <select defaultValue={developer.slug} disabled={!isEditing}>
                {developers.map((developerOption) => (
                  <option key={developerOption.id} value={developerOption.slug}>
                    {developerOption.name}
                  </option>
                ))}
              </select>
            </label>

            <FormSection title="Public project header">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                <ProjectInput defaultValue={project.title} isEditing={isEditing} label="Project title" />
                <ProjectInput defaultValue={project.statusLabel ?? ""} isEditing={isEditing} label="Status label" />
                <ProjectInput defaultValue={project.projectType} isEditing={isEditing} label="Project type" />
                <ProjectInput defaultValue={project.location} isEditing={isEditing} label="Project location" />
              </div>

              <ProjectTextarea defaultValue={project.description} isEditing={isEditing} label="Project description" />
            </FormSection>

            <FormSection title="Project stat strip">
              <div className="realtor-field-grid realtor-field-grid-three">
                <ProjectInput defaultValue={project.priceRange ?? ""} isEditing={isEditing} label="Project price" />
                <ProjectInput
                  defaultValue={project.totalLotsAvailable ?? ""}
                  isEditing={isEditing}
                  label="Total lots available"
                  type="number"
                />
                <ProjectInput defaultValue={project.levels ?? ""} isEditing={isEditing} label="Levels" />
                <ProjectInput defaultValue={project.lotSizeRange ?? ""} isEditing={isEditing} label="Lot size range" />
                <ProjectInput
                  defaultValue={project.completionLabel ?? ""}
                  isEditing={isEditing}
                  label="Completion label"
                />
              </div>
            </FormSection>

            <FormSection title="Site development plan details">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                <ProjectInput defaultValue={project.totalSiteArea ?? ""} isEditing={isEditing} label="Total site area" />
                <ProjectInput defaultValue={project.roadReserve ?? ""} isEditing={isEditing} label="Road reserve" />
                <ProjectInput defaultValue={project.commonZones ?? ""} isEditing={isEditing} label="Common zones" />
                <ProjectInput defaultValue={project.zoning ?? ""} isEditing={isEditing} label="Zoning" />
                <ProjectInput
                  defaultValue={project.sdpReference ?? project.sdpImage.caption}
                  isEditing={isEditing}
                  label="SDP reference"
                />
              </div>
            </FormSection>

            <FormSection title="Location section">
              <div className="realtor-field-grid">
                <ProjectInput
                  defaultValue={project.googleMapsUrl}
                  isEditing={isEditing}
                  label="Google Maps link"
                  type="url"
                />
                <ProjectInput
                  defaultValue={project.mapAddress ?? project.location}
                  isEditing={isEditing}
                  label="Map address"
                />
              </div>
            </FormSection>
          </section>

          <aside className="realtor-form-panel realtor-publishing-panel reveal reveal-delay-1 scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project facts</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-publish-box">
              <MapPin aria-hidden="true" className="h-7 w-7" />
              <strong>{developer.name}</strong>
              <p>Developer owner for this project profile.</p>
            </div>

            <RealtorPublishingControls
              defaultPublished
              draftLabel="Keep as draft"
              publishedLabel="Published on public catalog"
            />

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

          <section className="realtor-form-panel realtor-media-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project media</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-upload-grid">
              <RealtorImageUpload
                description="Main image shown on project cards, previews, and the project hero surfaces."
                disabled={!isEditing}
                initialImages={[project.coverImage, ...project.gallery]}
                label="Cover photo"
                manageable
                variant="wide"
              />
              <RealtorImageUpload
                description="Interior and exterior photos shown in the public house gallery."
                disabled={!isEditing}
                initialImages={project.gallery}
                label="House gallery photos"
                manageable
                multiple
                variant="gallery"
              />
              <RealtorImageUpload
                description="Site development plan image shown in the public SDP section."
                disabled={!isEditing}
                initialImages={[project.sdpImage]}
                label="SDP image"
                variant="wide"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function FormSection({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="realtor-form-subsection">
      <div className="realtor-subsection-divider">
        <h3>{title}</h3>
        <span aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

function ProjectInput({
  defaultValue,
  isEditing,
  label,
  type = "text"
}: {
  defaultValue: number | string;
  isEditing: boolean;
  label: string;
  type?: string;
}) {
  return (
    <label className="realtor-field">
      <span>{label}</span>
      <input defaultValue={defaultValue} min={type === "number" ? 0 : undefined} readOnly={!isEditing} type={type} />
    </label>
  );
}

function ProjectTextarea({
  defaultValue,
  isEditing,
  label
}: {
  defaultValue: string;
  isEditing: boolean;
  label: string;
}) {
  return (
    <label className="realtor-field realtor-field-full realtor-field-description">
      <span>{label}</span>
      <textarea defaultValue={defaultValue} readOnly={!isEditing} rows={7} />
    </label>
  );
}
