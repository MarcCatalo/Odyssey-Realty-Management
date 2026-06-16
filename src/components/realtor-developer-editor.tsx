"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Eye, Pencil, Save, Trash2 } from "lucide-react";

import { RealtorProjectManagementCard } from "@/components/realtor-project-management-card";
import type { Developer, Project } from "@/features/catalog/types";

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

  useEffect(() => {
    if (!showSavedToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSavedToast(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [showSavedToast]);

  function handleSave() {
    setIsEditing(false);
    setShowSavedToast(true);
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    router.push(`/realtor/developers?deleted=${developer.slug}`);
  }

  return (
    <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
      {showSavedToast ? (
        <div aria-live="polite" className="realtor-feedback-toast">
          <span>Edits have been saved.</span>
        </div>
      ) : null}

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
              <button className="realtor-danger-button" onClick={handleDeleteConfirm} type="button">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Delete profile
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
            <Link className="realtor-text-button" href={`/developers/${developer.slug}`} target="_blank">
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </Link>
            <button className="realtor-text-button" onClick={() => setIsEditing(true)} type="button">
              <Pencil aria-hidden="true" className="h-4 w-4" />
              Edit profile
            </button>
            {isEditing ? (
              <button className="realtor-save-button" onClick={handleSave} type="button">
                <Save aria-hidden="true" className="h-4 w-4" />
                Save changes
              </button>
            ) : null}
            <button className="realtor-danger-button" onClick={() => setShowDeleteModal(true)} type="button">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete profile
            </button>
          </div>
        </div>

        <form className="realtor-form-grid" aria-label={`Edit ${developer.name} form`}>
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Profile details</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-field-grid">
              <label className="realtor-field">
                <span>Developer name</span>
                <input defaultValue={developer.name} readOnly={!isEditing} type="text" />
              </label>
              <label className="realtor-field">
                <span>Specialty</span>
                <input defaultValue={developer.specialty} readOnly={!isEditing} type="text" />
              </label>
              <label className="realtor-field">
                <span>Primary coverage</span>
                <input defaultValue={developer.coverage} readOnly={!isEditing} type="text" />
              </label>
              <label className="realtor-field">
                <span>Profile slug</span>
                <input defaultValue={developer.slug} readOnly={!isEditing} type="text" />
              </label>
            </div>

            <label className="realtor-field realtor-field-full">
              <span>Developer description</span>
              <textarea defaultValue={developer.description} readOnly={!isEditing} rows={6} />
            </label>
          </section>

          <aside className="realtor-form-panel reveal reveal-delay-1 scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Status</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-publish-box">
              <Eye aria-hidden="true" className="h-7 w-7" />
              <strong>Published profile</strong>
              <p>The public developer profile is live and visible to buyers browsing this catalog.</p>
            </div>

            <label className="realtor-check-row">
              <input defaultChecked={developer.status === "published"} disabled={!isEditing} type="checkbox" />
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
