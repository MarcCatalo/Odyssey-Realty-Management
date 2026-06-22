"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";
import type { Developer } from "@/features/catalog/types";
import { refreshAfterMutation } from "@/lib/realtor-navigation";

type RealtorNewProjectFormProps = {
  developers: Developer[];
  selectedDeveloperSlug?: string;
};

const coreProjectFields = [
  { label: "Project title", name: "title", placeholder: "Example: Greenridge Villas", required: true },
  { label: "Status label", name: "statusLabel", placeholder: "Pre-selling, Ready for viewing, Selling now" },
  { label: "Project type", name: "projectType", placeholder: "House and lot, Townhouse, Condominium", required: true },
  { label: "Project location", name: "location", placeholder: "Quezon City, Metro Manila", required: true }
];

const projectStatFields = [
  { label: "Project price", name: "priceRange", placeholder: "5800000", type: "number" },
  { label: "Total lots available", name: "totalLotsAvailable", placeholder: "18", type: "number" },
  { label: "Levels", name: "levels", placeholder: "2", type: "number" },
  { label: "Lot size range", name: "lotSizeRange", placeholder: "180-220 sqm" },
  { label: "Completion label", name: "completionLabel", placeholder: "Q3 2026" }
];

const locationFields = [
  { label: "Google Maps link", name: "googleMapsUrl", placeholder: "https://maps.google.com/...", type: "url" },
  { label: "Map address", name: "mapAddress", placeholder: "42 Greenridge Drive, Quezon City, Metro Manila" }
];

const sdpFields = [
  { label: "Total site area", name: "totalSiteArea", placeholder: "6,240 sqm" },
  { label: "Road reserve", name: "roadReserve", placeholder: "Included" },
  { label: "Common zones", name: "commonZones", placeholder: "2" },
  { label: "Zoning", name: "zoning", placeholder: "R3 Medium Density" },
  { label: "SDP reference", name: "sdpReference", placeholder: "DA-2024-0847" }
];

export function RealtorNewProjectForm({
  developers,
  selectedDeveloperSlug
}: RealtorNewProjectFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [sdpFiles, setSdpFiles] = useState<File[]>([]);
  const fallbackDeveloperSlug = selectedDeveloperSlug ?? developers[0]?.slug;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/realtor/projects", {
      body: JSON.stringify({
        commonZones: formData.get("commonZones"),
        completionLabel: formData.get("completionLabel"),
        description: formData.get("description"),
        developerSlug: formData.get("developerSlug"),
        googleMapsUrl: formData.get("googleMapsUrl"),
        levels: formData.get("levels"),
        location: formData.get("location"),
        lotSizeRange: formData.get("lotSizeRange"),
        mapAddress: formData.get("mapAddress"),
        priceRange: formData.get("priceRange"),
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
      method: "POST"
    });
    const payload = (await response.json().catch(() => null)) as CreatedProjectResponse | null;

    if (!response.ok) {
      setIsSaving(false);
      setErrorMessage(payload?.message ?? "Project could not be saved.");
      return;
    }

    const createdProjectId = payload?.project?.id;

    if (createdProjectId) {
      const uploadError = await uploadQueuedProjectMedia(createdProjectId, {
        project_cover: coverFiles.slice(0, 1),
        project_gallery: galleryFiles,
        project_sdp: sdpFiles.slice(0, 1)
      });

      if (uploadError) {
        setIsSaving(false);
        setErrorMessage(uploadError);
        return;
      }
    }

    setIsSaving(false);
    refreshAfterMutation(router, payload?.redirectTo ?? "/realtor/developers");
  }

  return (
    <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="realtor-form-toolbar reveal">
          <Link className="realtor-text-button" href="/realtor/developers" prefetch>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to developers
          </Link>
          <button className="realtor-save-button" disabled={isSaving} form="new-project-form" type="submit">
            <Save aria-hidden="true" className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {errorMessage ? (
          <p className="realtor-form-error reveal" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form
          aria-label="Add new project form"
          className="realtor-form-grid"
          id="new-project-form"
          onSubmit={handleSubmit}
        >
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project details</h2>
              <span aria-hidden="true" />
            </div>

            <label className="realtor-field realtor-field-full realtor-field-start realtor-field-contained">
              <span>Publish under developer</span>
              <select defaultValue={fallbackDeveloperSlug} name="developerSlug" required>
                {developers.map((developer) => (
                  <option key={developer.id} value={developer.slug}>
                    {developer.name}
                  </option>
                ))}
              </select>
            </label>

            <FormSection title="Public project header">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                {coreProjectFields.map((field) => (
                  <TextField field={field} key={field.name} />
                ))}
              </div>

              <label className="realtor-field realtor-field-full realtor-field-description">
                <span>Project description</span>
                <textarea
                  name="description"
                  placeholder="Describe the project, buyer-facing strengths, unit style, location value, and turnover notes."
                  required
                  rows={7}
                />
              </label>
            </FormSection>

            <FormSection title="Project stat strip">
              <div className="realtor-field-grid realtor-field-grid-three">
                {projectStatFields.map((field) => (
                  <TextField field={field} key={field.name} />
                ))}
              </div>
            </FormSection>

            <FormSection title="Site development plan details">
              <div className="realtor-field-grid realtor-field-grid-balanced">
                {sdpFields.map((field) => (
                  <TextField field={field} key={field.name} />
                ))}
              </div>
            </FormSection>

            <FormSection title="Location section">
              <div className="realtor-field-grid">
                {locationFields.map((field) => (
                  <TextField field={field} key={field.name} />
                ))}
              </div>
            </FormSection>
          </section>

          <aside className="realtor-form-panel realtor-publishing-panel reveal reveal-delay-1 scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Publishing</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-publish-box">
              <Building2 aria-hidden="true" className="h-7 w-7" />
              <strong>Developer ownership</strong>
              <p>The backend checks developer ownership and project allowance before saving.</p>
            </div>

            <RealtorPublishingControls inputName="publicationStatus" />
          </aside>

          <section className="realtor-form-panel realtor-media-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Project media</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-upload-grid">
              <RealtorImageUpload
                description="Main image shown on project cards, previews, and the project hero surfaces."
                fallbackText="Cover"
                label="Cover photo"
                mediaRole="project_cover"
                onPendingFilesChange={setCoverFiles}
                variant="wide"
              />
              <RealtorImageUpload
                description="Interior and exterior photos shown in the public house gallery."
                fallbackText="Gallery"
                label="House gallery photos"
                manageable
                mediaRole="project_gallery"
                multiple
                onPendingFilesChange={setGalleryFiles}
                variant="gallery"
              />
              <RealtorImageUpload
                description="Site development plan image shown in the public SDP section."
                fallbackText="SDP"
                label="SDP image"
                mediaRole="project_sdp"
                onPendingFilesChange={setSdpFiles}
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

function TextField({
  field
}: {
  field: {
    label: string;
    name: string;
    placeholder: string;
    required?: boolean;
    type?: string;
  };
}) {
  return (
    <label className="realtor-field">
      <span>{field.label}</span>
      <input
        inputMode={field.type === "number" ? "numeric" : undefined}
        min={field.type === "number" ? 0 : undefined}
        name={field.name}
        onInput={
          field.type === "number"
            ? (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^\d]/g, "");
              }
            : undefined
        }
        placeholder={field.placeholder}
        required={field.required}
        type={field.type ?? "text"}
      />
    </label>
  );
}

type CreatedProjectResponse = {
  message?: string;
  project?: {
    id?: string;
  };
  redirectTo?: string;
};

async function uploadQueuedProjectMedia(
  projectId: string,
  filesByRole: Record<"project_cover" | "project_gallery" | "project_sdp", File[]>
) {
  for (const [role, files] of Object.entries(filesByRole) as Array<
    ["project_cover" | "project_gallery" | "project_sdp", File[]]
  >) {
    for (const file of files) {
      const mediaData = new FormData();
      mediaData.set("file", file);
      mediaData.set("projectId", projectId);
      mediaData.set("role", role);
      mediaData.set("altText", file.name);
      mediaData.set("caption", file.name.replace(/\.[^.]+$/, ""));

      const uploadResponse = await fetch("/api/realtor/media", {
        body: mediaData,
        method: "POST"
      });
      const uploadPayload = (await uploadResponse.json().catch(() => null)) as { message?: string } | null;

      if (!uploadResponse.ok) {
        return uploadPayload?.message ?? "Project was saved, but one or more images could not be uploaded.";
      }
    }
  }

  return null;
}
