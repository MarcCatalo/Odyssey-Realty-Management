"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Eye, Pencil, Plus, Save, Trash2 } from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorProjectManagementCard } from "@/components/realtor-project-management-card";
import type { Developer, Project } from "@/features/catalog/types";
import { refreshAfterMutation } from "@/lib/realtor-navigation";

type RealtorDeveloperEditorProps = {
  developer: Developer;
  developerProjects: Project[];
};

export function RealtorDeveloperEditor({
  developer,
  developerProjects
}: RealtorDeveloperEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const initials = developer.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

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
    const response = await fetch("/api/realtor/developers", {
      body: JSON.stringify({
        coverage: formData.get("coverage"),
        description: formData.get("description"),
        name: formData.get("name"),
        publicationStatus: formData.get("isPublished") === "on" ? "published" : "draft",
        slug: developer.slug,
        specialty: formData.get("specialty")
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
      setErrorMessage(payload?.message ?? "Developer could not be updated.");
      return;
    }

    setIsEditing(false);
    setShowSavedToast(true);
    refreshAfterMutation(router, payload?.redirectTo);
  }

  async function handleDeleteConfirm() {
    setErrorMessage(null);
    setIsDeleting(true);

    const response = await fetch("/api/realtor/developers", {
      body: JSON.stringify({ slug: developer.slug }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "DELETE"
    });
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      redirectTo?: string;
    } | null;

    setIsDeleting(false);

    if (!response.ok) {
      setShowDeleteModal(false);
      setErrorMessage(payload?.message ?? "Developer could not be deleted.");
      return;
    }

    setShowDeleteModal(false);
    refreshAfterMutation(router, `${payload?.redirectTo ?? "/realtor/developers"}?deleted=${developer.slug}`);
  }

  return (
    <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
      {showDeleteModal ? (
        <div className="realtor-confirm-overlay" role="presentation">
          <div
            aria-describedby="delete-developer-description"
            aria-modal="true"
            className="realtor-confirm-modal"
            role="dialog"
          >
            <AlertTriangle aria-hidden="true" className="h-8 w-8 text-[#b3261e]" />
            <h2>Delete developer profile?</h2>
            <p id="delete-developer-description">
              This will remove {developer.name} from the realtor catalog view. Do you want to continue?
            </p>
            <div className="realtor-confirm-actions">
              <button className="realtor-text-button" onClick={() => setShowDeleteModal(false)} type="button">
                Cancel
              </button>
              <button className="realtor-danger-button" disabled={isDeleting} onClick={handleDeleteConfirm} type="button">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete profile"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl">
        <div className="realtor-form-toolbar reveal">
          <Link className="realtor-text-button" href="/realtor/developers" prefetch>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to developers
          </Link>
          <div className="realtor-toolbar-actions">
            {showSavedToast ? (
              <div aria-live="polite" className="realtor-feedback-toast">
                <span>Edits have been saved.</span>
              </div>
            ) : null}
            <Link className="realtor-text-button" href={`/developers/${developer.slug}`} target="_blank">
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </Link>
            <button className="realtor-text-button" onClick={() => setIsEditing(true)} type="button">
              <Pencil aria-hidden="true" className="h-4 w-4" />
              Edit profile
            </button>
            {isEditing ? (
              <button className="realtor-save-button" disabled={isSaving} form="edit-developer-form" type="submit">
                <Save aria-hidden="true" className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            ) : null}
            <button className="realtor-danger-button" onClick={() => setShowDeleteModal(true)} type="button">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete profile
            </button>
          </div>
        </div>

        {errorMessage ? (
          <p className="realtor-form-error reveal" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form
          className="realtor-form-grid"
          aria-label={`Edit ${developer.name} form`}
          id="edit-developer-form"
          onSubmit={handleSave}
        >
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Profile details</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-field-grid">
              <label className="realtor-field">
                <span>Developer name</span>
                <input defaultValue={developer.name} name="name" readOnly={!isEditing} required type="text" />
              </label>
              <label className="realtor-field">
                <span>Specialty</span>
                <input defaultValue={developer.specialty} name="specialty" readOnly={!isEditing} required type="text" />
              </label>
              <label className="realtor-field">
                <span>Primary coverage</span>
                <input defaultValue={developer.coverage} name="coverage" readOnly={!isEditing} required type="text" />
              </label>
            </div>

            <label className="realtor-field realtor-field-full">
              <span>Developer description</span>
              <textarea defaultValue={developer.description} name="description" readOnly={!isEditing} required rows={6} />
            </label>
          </section>

          <aside className="realtor-form-panel reveal reveal-delay-1 scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Publishing</h2>
              <span aria-hidden="true" />
            </div>

            <RealtorImageUpload
              description="Logo used on developer cards and the public developer profile."
              disabled={!isEditing}
              fallbackText={initials}
              label="Developer logo"
              variant="logo"
            />

            <label className="realtor-check-row">
              <input
                defaultChecked={developer.status === "published"}
                disabled={!isEditing}
                name="isPublished"
                type="checkbox"
              />
              <span>Published on public catalog</span>
            </label>
          </aside>
        </form>

        <section className="realtor-projects-section reveal scroll-reveal">
          <div className="profile-projects-heading">
            <h2>Recent projects</h2>
            <span aria-hidden="true" />
            <p>Available</p>
          </div>
          <div className="profile-projects-grid stagger-list">
            <Link
              className="realtor-add-card interactive-card reveal scroll-reveal"
              href={`/realtor/projects/new?developer=${developer.slug}`}
              prefetch
            >
              <span className="realtor-add-icon">
                <Plus aria-hidden="true" className="h-12 w-12" />
              </span>
              <h3>Add new project</h3>
              <p>Create a project profile under {developer.name}.</p>
            </Link>
            {developerProjects.map((project) => (
              <RealtorProjectManagementCard
                developerSlug={developer.slug}
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
