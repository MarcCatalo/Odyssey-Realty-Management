"use client";

import { useEffect, useState } from "react";
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

import type { SalesAgent } from "@/features/catalog/types";

type RealtorContactProfileEditorProps = {
  salesAgent: SalesAgent;
};

export function RealtorContactProfileEditor({ salesAgent }: RealtorContactProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const phoneLink = salesAgent.contactLinks.find((link) => link.type === "phone");
  const emailLink = salesAgent.contactLinks.find((link) => link.type === "email");
  const socialFields = [
    { icon: Share2, label: "Facebook page", value: salesAgent.socials.find((link) => link.type === "facebook")?.value ?? "" },
    { icon: AtSign, label: "Instagram", value: salesAgent.socials.find((link) => link.type === "instagram")?.value ?? "" },
    { icon: Globe, label: "LinkedIn", value: salesAgent.socials.find((link) => link.type === "linkedin")?.value ?? "" },
    { icon: Globe, label: "Other website", value: salesAgent.socials.find((link) => link.type === "website")?.value ?? "" }
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

  function handleSave() {
    setIsEditing(false);
    setShowSavedToast(true);
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
        <div className="mx-auto max-w-7xl">
          <div className="realtor-form-toolbar reveal">
            <div />
            <div className="realtor-toolbar-actions">
              {showSavedToast ? (
                <div aria-live="polite" className="realtor-feedback-toast">
                  <span>Edits have been saved.</span>
                </div>
              ) : null}
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
            </div>
          </div>

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
                  <input defaultValue={salesAgent.name} readOnly={!isEditing} required type="text" />
                </label>
                <label className="realtor-field">
                  <span>Contact number</span>
                  <input defaultValue={phoneLink?.value ?? ""} readOnly={!isEditing} required type="tel" />
                </label>
                <label className="realtor-field">
                  <span>Email address</span>
                  <input defaultValue={emailLink?.value ?? ""} readOnly={!isEditing} required type="email" />
                </label>
                <label className="realtor-field">
                  <span>Business label</span>
                  <input defaultValue={salesAgent.businessLabel} readOnly={!isEditing} required type="text" />
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
                      <input defaultValue={field.value} readOnly={!isEditing} type="text" />
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
                  <input defaultValue={salesAgent.headerMain} readOnly={!isEditing} required type="text" />
                </label>
                <label className="realtor-field">
                  <span>Catalog slug</span>
                  <input defaultValue={salesAgent.catalogSlug} readOnly={!isEditing} required type="text" />
                </label>
                <label className="realtor-field">
                  <span>Main sub-header</span>
                  <input
                    defaultValue={salesAgent.headerPrimarySubheader}
                    readOnly={!isEditing}
                    required
                    type="text"
                  />
                </label>
                <label className="realtor-field realtor-field-full">
                  <span>Second sub-header</span>
                  <textarea
                    defaultValue={salesAgent.headerSecondarySubheader}
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
        </div>
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
