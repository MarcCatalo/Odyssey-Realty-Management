import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Save
} from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";

const profileFields = [
  {
    label: "Developer name",
    placeholder: "Example: PrimeBuild Homes",
    helper: "Shown as the developer profile title on the public catalog. The developer URL slug is generated automatically."
  },
  {
    label: "Specialty",
    placeholder: "House and lot communities",
    helper: "Short category shown on cards and headers."
  },
  {
    label: "Primary coverage",
    placeholder: "Quezon City, Metro Manila",
    helper: "Use the main service area or project coverage."
  }
];

export default function NewDeveloperPage() {
  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">New developer</p>
            <h1>Add developer</h1>
            <p>
              Fill in the core public details first. Projects, gallery assets, and publishing checks can
              be added after this developer profile exists.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card lift-card">
              <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
              <h2>Choose visibility</h2>
              <p>Save the developer as a draft or publish it directly to the public catalog.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="realtor-form-toolbar reveal">
            <Link className="realtor-text-button" href="/realtor/developers" prefetch>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to developers
            </Link>
            <button className="realtor-save-button" type="button">
              <Save aria-hidden="true" className="h-4 w-4" />
              Save
            </button>
          </div>

          <form className="realtor-form-grid" aria-label="Add new developer form">
            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Profile details</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-field-grid realtor-field-grid-balanced">
                {profileFields.map((field) => (
                  <label className="realtor-field" key={field.label}>
                    <span>{field.label}</span>
                    <input placeholder={field.placeholder} type="text" />
                    <small>{field.helper}</small>
                  </label>
                ))}
              </div>

              <label className="realtor-field realtor-field-full realtor-field-description">
                <span>Developer description</span>
                <textarea
                  placeholder="Describe the developer's positioning, project strengths, and public buyer-facing notes."
                  rows={6}
                />
                <small>Keep this concise. This copy appears near the top of the developer profile.</small>
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
                <p>This account can publish 6 more developer profiles under the current plan.</p>
              </div>

              <RealtorImageUpload
                description="Logo used on developer cards and the public developer profile."
                fallbackText="Logo"
                label="Developer logo"
                variant="logo"
              />

              <RealtorPublishingControls />
            </aside>

          </form>
        </div>
      </section>
    </>
  );
}
