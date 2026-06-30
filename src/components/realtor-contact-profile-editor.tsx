"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  Globe,
  Mail,
  Pencil,
  Phone,
  Save,
  Share2,
  Upload,
  UserRound
} from "lucide-react";

import { RealtorFeedbackToast } from "@/components/realtor-feedback-toast";
import type { SalesAgent } from "@/features/catalog/types";
import { refreshAfterMutation } from "@/lib/realtor-navigation";

type RealtorContactProfileEditorProps = {
  salesAgent: SalesAgent;
};

export function RealtorContactProfileEditor({ salesAgent }: RealtorContactProfileEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const phoneLink = salesAgent.contactLinks.find((link) => link.type === "phone");
  const emailLink = salesAgent.contactLinks.find((link) => link.type === "email");
  const socialFields = [
    {
      icon: Share2,
      label: "Facebook page",
      name: "facebook",
      value: salesAgent.socials.find((link) => link.type === "facebook")?.href ?? ""
    },
    {
      icon: AtSign,
      label: "Instagram",
      name: "instagram",
      value: salesAgent.socials.find((link) => link.type === "instagram")?.href ?? ""
    },
    {
      icon: Globe,
      label: "LinkedIn",
      name: "linkedin",
      value: salesAgent.socials.find((link) => link.type === "linkedin")?.href ?? ""
    },
    {
      icon: Globe,
      label: "Other website",
      name: "website",
      value: salesAgent.socials.find((link) => link.type === "website")?.href ?? ""
    }
  ];

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
    const response = await fetch("/api/realtor/profile", {
      body: JSON.stringify({
        businessName: formData.get("businessName"),
        email: formData.get("email"),
        headerMain: formData.get("headerMain"),
        headerPrimarySubheader: formData.get("headerPrimarySubheader"),
        headerSecondarySubheader: formData.get("headerSecondarySubheader"),
        phone: formData.get("phone"),
        socials: {
          facebook: formData.get("facebook"),
          instagram: formData.get("instagram"),
          linkedin: formData.get("linkedin"),
          website: formData.get("website")
        },
        title: formData.get("title")
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    setIsSaving(false);

    if (!response.ok) {
      setErrorMessage(payload?.message ?? "Profile details could not be saved.");
      return;
    }

    setIsEditing(false);
    setShowSavedToast(true);
    refreshAfterMutation(router);
  }

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Profile</p>
            <h1>Realtor identity</h1>
            <p>Manage the contact details and catalog header shown on public buyer-facing pages.</p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card realtor-status-card-accent">
              <UserRound aria-hidden="true" className="h-8 w-8" />
              <h2>{salesAgent.name}</h2>
              <p>{salesAgent.title}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="realtor-dashboard-section px-5 py-10 md:px-10">
        <form className="mx-auto max-w-7xl" onSubmit={handleSave}>
          <div className="realtor-form-toolbar reveal">
            <div />
            <div className="realtor-toolbar-actions">
              {showSavedToast ? (
                <RealtorFeedbackToast message="Edits have been saved." />
              ) : null}
              <button className="realtor-text-button" onClick={() => setIsEditing(true)} type="button">
                <Pencil aria-hidden="true" className="h-4 w-4" />
                Edit profile
              </button>
              {isEditing ? (
                <button className="realtor-save-button" disabled={isSaving} type="submit">
                  <Save aria-hidden="true" className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              ) : null}
            </div>
          </div>

          {errorMessage ? (
            <p className="realtor-form-error reveal" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="realtor-profile-editor-grid">
            <aside className="realtor-profile-photo-panel reveal scroll-reveal">
              <h2>Profile photo</h2>
              <div className="realtor-profile-photo-preview">
                {salesAgent.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={salesAgent.profileImage.alt} src={salesAgent.profileImage.src} />
                ) : (
                  <>
                    <UserRound aria-hidden="true" className="h-8 w-8" />
                    <strong>{getInitials(salesAgent.name)}</strong>
                  </>
                )}
              </div>
              <label aria-disabled={!isEditing} className="realtor-upload-button">
                <Upload aria-hidden="true" className="h-4 w-4" />
                Upload photo
                <input accept="image/*" disabled={!isEditing} type="file" />
              </label>
              {!isEditing ? <p>Click edit before changing this photo.</p> : null}
            </aside>

            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Profile details</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-field-grid">
                <label className="realtor-field">
                  <span>Realtor name</span>
                  <input
                    defaultValue={salesAgent.name}
                    name="businessName"
                    readOnly={!isEditing}
                    required
                    type="text"
                  />
                </label>
                <label className="realtor-field">
                  <span>Contact number</span>
                  <input
                    defaultValue={phoneLink?.value ?? ""}
                    name="phone"
                    readOnly={!isEditing}
                    required
                    type="tel"
                  />
                </label>
                <label className="realtor-field">
                  <span>Email address</span>
                  <input
                    defaultValue={emailLink?.value ?? ""}
                    name="email"
                    readOnly={!isEditing}
                    required
                    type="email"
                  />
                </label>
                <label className="realtor-field">
                  <span>Professional title</span>
                  <input
                    defaultValue={salesAgent.title}
                    name="title"
                    readOnly={!isEditing}
                    required
                    type="text"
                  />
                </label>
              </div>

              <div className="realtor-subsection-divider">
                <h3>Optional socials</h3>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-social-list">
                {socialFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <label className="realtor-social-field" key={field.label}>
                      <span>
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {field.label}
                      </span>
                      <input
                        defaultValue={field.value}
                        name={field.name}
                        placeholder="https://"
                        readOnly={!isEditing}
                        type="url"
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="realtor-form-panel realtor-profile-header-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Website header</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-field-grid">
                <label className="realtor-field">
                  <span>Main header</span>
                  <input
                    defaultValue={salesAgent.headerMain}
                    name="headerMain"
                    readOnly={!isEditing}
                    required
                    type="text"
                  />
                </label>
                <label className="realtor-field">
                  <span>Catalog slug</span>
                  <input defaultValue={salesAgent.catalogSlug} readOnly required type="text" />
                </label>
                <label className="realtor-field">
                  <span>Main sub-header</span>
                  <input
                    defaultValue={salesAgent.headerPrimarySubheader}
                    name="headerPrimarySubheader"
                    readOnly={!isEditing}
                    required
                    type="text"
                  />
                </label>
                <label className="realtor-field realtor-field-full">
                  <span>Second sub-header</span>
                  <textarea
                    defaultValue={salesAgent.headerSecondarySubheader}
                    name="headerSecondarySubheader"
                    readOnly={!isEditing}
                    required
                    rows={4}
                  />
                </label>
              </div>

              <div className="realtor-header-preview">
                <p>Public header preview</p>
                <strong>{salesAgent.headerMain}</strong>
                <em>{salesAgent.headerPrimarySubheader}</em>
                <small>{salesAgent.headerSecondarySubheader}</small>
                <span>/{salesAgent.catalogSlug}</span>
              </div>
            </section>
          </div>
        </form>
      </section>
    </>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
