import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save
} from "lucide-react";

const profileFields = [
  {
    label: "Developer name",
    placeholder: "Example: PrimeBuild Homes",
    helper: "Shown as the developer profile title on the public catalog."
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
  },
  {
    label: "Public profile slug",
    placeholder: "primebuild-homes",
    helper: "Auto-generated later from the developer name, editable only before publishing."
  }
];

const contactFields = [
  { label: "Developer email", icon: Mail, placeholder: "sales@developer.com" },
  { label: "Phone number", icon: Phone, placeholder: "+63 900 000 0000" },
  { label: "Website", icon: Globe, placeholder: "https://developer.com" },
  { label: "Social page", icon: Plus, placeholder: "Facebook, Instagram, LinkedIn, or custom URL" }
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
              <h2>Profile starts as draft</h2>
              <p>Draft developers stay hidden from the public catalog until published.</p>
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
              Save draft
            </button>
          </div>

          <form className="realtor-form-grid" aria-label="Add new developer form">
            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Profile details</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-field-grid">
                {profileFields.map((field) => (
                  <label className="realtor-field" key={field.label}>
                    <span>{field.label}</span>
                    <input placeholder={field.placeholder} type="text" />
                    <small>{field.helper}</small>
                  </label>
                ))}
              </div>

              <label className="realtor-field realtor-field-full">
                <span>Developer description</span>
                <textarea
                  placeholder="Describe the developer's positioning, project strengths, and public buyer-facing notes."
                  rows={6}
                />
                <small>Keep this concise. This copy appears near the top of the developer profile.</small>
              </label>
            </section>

            <aside className="realtor-form-panel reveal reveal-delay-1 scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Publishing</h2>
                <span aria-hidden="true" />
              </div>

              <div className="realtor-publish-box">
                <Building2 aria-hidden="true" className="h-7 w-7" />
                <strong>Developer allowance</strong>
                <p>This account can publish 6 more developer profiles under the current plan.</p>
              </div>

              <label className="realtor-check-row">
                <input defaultChecked type="checkbox" />
                <span>Save as draft after creation</span>
              </label>
              <label className="realtor-check-row">
                <input type="checkbox" />
                <span>Mark as ready for review</span>
              </label>
            </aside>

            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Developer contact</h2>
                <span aria-hidden="true" />
              </div>

              <p className="realtor-form-note">
                These are developer-specific contact details. Public project enquiries still default to
                the realtor contact unless a developer surface needs its own reference.
              </p>

              <div className="realtor-field-grid">
                {contactFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <label className="realtor-field" key={field.label}>
                      <span>{field.label}</span>
                      <div className="realtor-input-with-icon">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        <input placeholder={field.placeholder} type="text" />
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="realtor-form-panel reveal reveal-delay-1 scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>First project notes</h2>
                <span aria-hidden="true" />
              </div>

              <label className="realtor-field realtor-field-full">
                <span>Internal setup notes</span>
                <textarea
                  placeholder="Optional: record what project pages or gallery assets need to be added next."
                  rows={7}
                />
              </label>

              <div className="realtor-next-step-card">
                <MapPin aria-hidden="true" className="h-6 w-6" />
                <strong>Projects come next</strong>
                <p>
                  After saving the developer, the manage developer page will provide the add new project
                  card and project-specific gallery, SDP, and location fields.
                </p>
              </div>
            </section>
          </form>
        </div>
      </section>
    </>
  );
}
