"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
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

import { RealtorAmenitiesField } from "@/components/realtor-amenities-field";
import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorFeedbackToast } from "@/components/realtor-feedback-toast";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";
import type { Developer, Project } from "@/features/catalog/types";
import { refreshAfterMutation } from "@/lib/realtor-navigation";

type RealtorProjectEditorProps = {
  developer: Developer;
  developers: Developer[];
  project: Project;
};

export function RealtorProjectEditor({ developer, developers, project }: RealtorProjectEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!showSavedToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSavedToast(false);
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [showSavedToast]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/realtor/projects", {
      body: JSON.stringify({
        commonZones: formData.get("commonZones"),
        completionLabel: formData.get("completionLabel"),
        currentDeveloperSlug: developer.slug,
        description: formData.get("description"),
        developerSlug: formData.get("developerSlug"),
        featuresAmenities: formData
          .getAll("featuresAmenities")
          .map(String)
          .map((value) => value.trim())
          .filter(Boolean),
        levels: formData.get("levels"),
        location: formData.get("location"),
        lotSizeRange: formData.get("lotSizeRange"),
        priceRange: formData.get("priceRange"),
        projectSlug: project.slug,
        projectType: formData.get("projectType"),
        publicationStatus: formData.get("publicationStatus"),
        roadReserve: formData.get("roadReserve"),
        sdpReference: formData.get("sdpReference"),
        statusLabel: formData.get("statusLabel"),
        title: formData.get("title"),
        totalLotsAvailable: formData.get("totalLotsAvailable") || null,
        totalSiteArea: formData.get("totalSiteArea"),
        zoning: formData.get("zoning")
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      redirectTo?: string;
    } | null;

    setIsSaving(false);

    if (!response.ok) {
      setErrorMessage(payload?.message ?? "Project could not be updated.");
      return;
    }

    setIsEditing(false);
    setShowSavedToast(true);
    refreshAfterMutation(router, payload?.redirectTo);
  }

  async function handleDeleteConfirm() {
    setErrorMessage(null);
    setIsDeleting(true);

    const response = await fetch("/api/realtor/projects", {
      body: JSON.stringify({
        developerSlug: developer.slug,
        projectSlug: project.slug
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "DELETE"
    });
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      redirectTo?: string;
    } | null;

    if (!response.ok) {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setErrorMessage(payload?.message ?? "Project could not be deleted.");
      return;
    }

    refreshAfterMutation(
      router,
      `${payload?.redirectTo ?? `/realtor/developers/${developer.slug}`}?projectDeleted=${project.slug}`
    );
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
              This will permanently delete {project.title} and its media links from this developer profile.
            </p>
            <div className="realtor-confirm-actions">
              <button className="realtor-text-button" onClick={() => setShowDeleteModal(false)} type="button">
                Cancel
              </button>
              <button className="realtor-danger-button" disabled={isDeleting} onClick={handleDeleteConfirm} type="button">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete project"}
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
              <RealtorFeedbackToast message="Edits have been saved." />
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
              <button className="realtor-save-button" disabled={isSaving} form="edit-project-form" type="submit">
                <Save aria-hidden="true" className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            ) : null}
            <button className="realtor-danger-button" onClick={() => setShowDeleteModal(true)} type="button">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete project
            </button>
          </div>
        </div>

        {errorMessage ? (
          <p className="realtor-form-error reveal" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form className="realtor-form-grid" id="edit-project-form" onSubmit={handleSave}>
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project details</h2>
              <span aria-hidden="true" />
            </div>

            <label className="realtor-field realtor-field-full realtor-field-start realtor-field-contained">
              <span>Publish under developer</span>
              <select defaultValue={developer.slug} disabled={!isEditing} name="developerSlug" required>
                {developers.map((developerOption) => (
                  <option key={developerOption.id} value={developerOption.slug}>
                    {developerOption.name}
                  </option>
                ))}
              </select>
            </label>

            <FormSection title="Public project header">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                <ProjectInput defaultValue={project.title} isEditing={isEditing} label="Project title" name="title" />
                <ProjectInput defaultValue={project.statusLabel ?? ""} isEditing={isEditing} label="Status label" name="statusLabel" />
                <ProjectInput defaultValue={project.projectType} isEditing={isEditing} label="Project type" name="projectType" />
                <ProjectInput defaultValue={project.location} isEditing={isEditing} label="Project location" name="location" />
              </div>

              <ProjectTextarea defaultValue={project.description} isEditing={isEditing} label="Project description" name="description" />
            </FormSection>

            <FormSection title="Project stat strip">
              <div className="realtor-field-grid realtor-field-grid-three">
                <ProjectInput
                  defaultValue={project.priceRange ?? ""}
                  isEditing={isEditing}
                  label="Project price"
                  name="priceRange"
                  type="number"
                />
                <ProjectInput
                  defaultValue={project.totalLotsAvailable ?? ""}
                  isEditing={isEditing}
                  label="Total lots available"
                  name="totalLotsAvailable"
                  type="number"
                />
                <ProjectInput defaultValue={project.levels ?? ""} isEditing={isEditing} label="Levels" name="levels" type="number" />
                <ProjectInput defaultValue={project.lotSizeRange ?? ""} isEditing={isEditing} label="Lot size range" name="lotSizeRange" />
                <ProjectInput
                  defaultValue={project.completionLabel ?? ""}
                  isEditing={isEditing}
                  label="Completion label"
                  name="completionLabel"
                />
              </div>
            </FormSection>

            <FormSection title="Site development plan details">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                <ProjectInput defaultValue={project.totalSiteArea ?? ""} isEditing={isEditing} label="Total site area" name="totalSiteArea" />
                <ProjectInput defaultValue={project.roadReserve ?? ""} isEditing={isEditing} label="Road reserve" name="roadReserve" />
                <ProjectInput defaultValue={project.commonZones ?? ""} isEditing={isEditing} label="Common zones" name="commonZones" />
                <ProjectInput defaultValue={project.zoning ?? ""} isEditing={isEditing} label="Zoning" name="zoning" />
                <ProjectInput
                  defaultValue={project.sdpReference ?? project.sdpImage.caption}
                  isEditing={isEditing}
                  label="SDP reference"
                  name="sdpReference"
                />
              </div>
            </FormSection>

            <FormSection title="Features and amenities">
              <RealtorAmenitiesField
                disabled={!isEditing}
                initialValues={project.featuresAmenities}
              />
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
              defaultPublished={project.publicationStatus === "published"}
              draftLabel="Keep as draft"
              inputName="publicationStatus"
              publishedLabel="Published on public catalog"
            />

            <div className="realtor-detail-stack">
              <div className="realtor-detail-row">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                <span>{project.featuresAmenities.length} amenities listed</span>
              </div>
              <div className="realtor-detail-row">
                <Ruler aria-hidden="true" className="h-4 w-4" />
                <span>{project.gallery.length} house model images</span>
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
                initialImages={[project.coverImage, ...project.gallery].filter(isPersistedProjectImage)}
                label="Cover photo"
                manageable
                mediaRole="project_cover"
                projectId={project.id}
                variant="wide"
              />
              <RealtorImageUpload
                description="Interior and exterior photos shown in the public house models section."
                disabled={!isEditing}
                initialImages={project.gallery}
                label="House model photos"
                manageable
                mediaRole="project_gallery"
                multiple
                projectId={project.id}
                variant="gallery"
              />
              <RealtorImageUpload
                description="Site development plan image shown in the public SDP section."
                disabled={!isEditing}
                initialImages={[project.sdpImage].filter(isPersistedProjectImage)}
                label="SDP image"
                mediaRole="project_sdp"
                projectId={project.id}
                variant="wide"
              />
            </div>
          </section>
        </form>
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
  name,
  type = "text"
}: {
  defaultValue: number | string;
  isEditing: boolean;
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="realtor-field">
      <span>{label}</span>
      <input
        defaultValue={defaultValue}
        inputMode={type === "number" ? "numeric" : undefined}
        min={type === "number" ? 0 : undefined}
        name={name}
        onInput={
          type === "number"
            ? (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^\d]/g, "");
              }
            : undefined
        }
        readOnly={!isEditing}
        required={["title", "description", "location", "projectType"].includes(name)}
        type={type}
      />
    </label>
  );
}

function isPersistedProjectImage(image: Project["coverImage"]) {
  return !image.id.startsWith("fallback-");
}

function ProjectTextarea({
  defaultValue,
  isEditing,
  label,
  name
}: {
  defaultValue: string;
  isEditing: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="realtor-field realtor-field-full realtor-field-description">
      <span>{label}</span>
      <textarea defaultValue={defaultValue} name={name} readOnly={!isEditing} required rows={7} />
    </label>
  );
}
