"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";
import { refreshAfterMutation } from "@/lib/realtor-navigation";

const profileFields = [
  {
    label: "Developer name",
    name: "name",
    placeholder: "Example: PrimeBuild Homes"
  },
  {
    label: "Specialty",
    name: "specialty",
    placeholder: "House and lot communities"
  },
  {
    label: "Primary coverage",
    name: "coverage",
    placeholder: "Quezon City, Metro Manila"
  }
];

export function RealtorNewDeveloperForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/realtor/developers", {
      body: JSON.stringify({
        name: formData.get("name"),
        specialty: formData.get("specialty"),
        coverage: formData.get("coverage"),
        description: formData.get("description"),
        publicationStatus: formData.get("publicationStatus")
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    const payload = (await response.json().catch(() => null)) as {
      developer?: {
        slug?: string;
      };
      message?: string;
      redirectTo?: string;
    } | null;

    if (!response.ok) {
      setIsSaving(false);
      setErrorMessage(payload?.message ?? "Developer could not be saved.");
      return;
    }

    if (payload?.developer?.slug && logoFiles[0]) {
      const mediaData = new FormData();
      mediaData.set("file", logoFiles[0]);
      mediaData.set("developerSlug", payload.developer.slug);
      mediaData.set("role", "developer_logo");
      mediaData.set("altText", logoFiles[0].name);
      mediaData.set("caption", logoFiles[0].name.replace(/\.[^.]+$/, ""));

      const uploadResponse = await fetch("/api/realtor/media", {
        body: mediaData,
        method: "POST"
      });
      const uploadPayload = (await uploadResponse.json().catch(() => null)) as { message?: string } | null;

      if (!uploadResponse.ok) {
        setIsSaving(false);
        setErrorMessage(uploadPayload?.message ?? "Developer was saved, but the logo could not be uploaded.");
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
          <button className="realtor-save-button" disabled={isSaving} form="new-developer-form" type="submit">
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
          aria-label="Add new developer form"
          className="realtor-form-grid"
          id="new-developer-form"
          onSubmit={handleSubmit}
        >
          <section className="realtor-form-panel reveal scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Profile details</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-field-grid realtor-field-grid-balanced">
              {profileFields.map((field) => (
                <label className="realtor-field" key={field.name}>
                  <span>{field.label}</span>
                  <input name={field.name} placeholder={field.placeholder} required type="text" />
                </label>
              ))}
            </div>

            <label className="realtor-field realtor-field-full realtor-field-description">
              <span>Developer description</span>
              <textarea
                name="description"
                placeholder="Describe the developer positioning, project strengths, and public buyer-facing notes."
                required
                rows={6}
              />
            </label>
          </section>

          <aside className="realtor-form-panel realtor-publishing-panel reveal reveal-delay-1 scroll-reveal">
            <div className="realtor-section-heading realtor-form-heading">
              <h2>Publishing</h2>
              <span aria-hidden="true" />
            </div>

            <div className="realtor-publish-box">
              <Building2 aria-hidden="true" className="h-7 w-7" />
              <strong>Developer allowance</strong>
              <p>The backend checks the active subscription before saving.</p>
            </div>

            <RealtorImageUpload
              description="Logo used on developer cards and the public developer profile."
              fallbackText="Logo"
              label="Developer logo"
              mediaRole="developer_logo"
              onPendingFilesChange={setLogoFiles}
              variant="logo"
            />

            <RealtorPublishingControls inputName="publicationStatus" />
          </aside>
        </form>
      </div>
    </section>
  );
}
