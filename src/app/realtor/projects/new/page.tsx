import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Building2, Save } from "lucide-react";

import { RealtorImageUpload } from "@/components/realtor-image-upload";
import { RealtorPublishingControls } from "@/components/realtor-publishing-controls";
import { developers } from "@/features/catalog/data";

type NewProjectPageProps = {
  searchParams?: {
    developer?: string;
  };
};

const coreProjectFields = [
  {
    label: "Project title",
    placeholder: "Example: Greenridge Villas"
  },
  {
    label: "Status label",
    placeholder: "Pre-selling, Ready for viewing, Selling now"
  },
  {
    label: "Project type",
    placeholder: "House and lot, Townhouse, Condominium"
  },
  {
    label: "Project location",
    placeholder: "Quezon City, Metro Manila"
  }
];

const projectStatFields = [
  {
    label: "Project price",
    placeholder: "From PHP 5.8M"
  },
  {
    label: "Total lots available",
    placeholder: "18",
    type: "number"
  },
  {
    label: "Levels",
    placeholder: "2"
  },
  {
    label: "Lot size range",
    placeholder: "180-220 sqm"
  },
  {
    label: "Completion label",
    placeholder: "Q3 2026"
  }
];

const locationFields = [
  {
    label: "Google Maps link",
    placeholder: "https://maps.google.com/...",
    type: "url"
  },
  {
    label: "Map address",
    placeholder: "42 Greenridge Drive, Quezon City, Metro Manila"
  }
];

const sdpFields = [
  {
    label: "Total site area",
    placeholder: "6,240 sqm"
  },
  {
    label: "Road reserve",
    placeholder: "Included"
  },
  {
    label: "Common zones",
    placeholder: "2"
  },
  {
    label: "Zoning",
    placeholder: "R3 Medium Density"
  },
  {
    label: "SDP reference",
    placeholder: "DA-2024-0847"
  }
];

export default function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const selectedDeveloperSlug = searchParams?.developer ?? developers[0]?.slug;

  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">New project</p>
            <h1>Add project</h1>
            <p>
              Create a project page, assign it to a developer, and prepare the public details,
              house gallery, SDP, and location fields.
            </p>
          </div>
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

          <form className="realtor-form-grid" aria-label="Add new project form">
            <section className="realtor-form-panel reveal scroll-reveal">
              <div className="realtor-section-heading realtor-form-heading">
                <h2>Project details</h2>
                <span aria-hidden="true" />
              </div>

              <label className="realtor-field realtor-field-full realtor-field-start realtor-field-contained">
                <span>Publish under developer</span>
                <select defaultValue={selectedDeveloperSlug}>
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
                    <TextField field={field} key={field.label} />
                  ))}
                </div>

                <label className="realtor-field realtor-field-full realtor-field-description">
                  <span>Project description</span>
                  <textarea
                    placeholder="Describe the project, buyer-facing strengths, unit style, location value, and turnover notes."
                    rows={7}
                  />
                </label>
              </FormSection>

              <FormSection title="Project stat strip">
                <div className="realtor-field-grid realtor-field-grid-three">
                  {projectStatFields.map((field) => (
                    <TextField field={field} key={field.label} />
                  ))}
                </div>
              </FormSection>

              <FormSection title="Site development plan details">
                <div className="realtor-field-grid realtor-field-grid-balanced">
                  {sdpFields.map((field) => (
                    <TextField field={field} key={field.label} />
                  ))}
                </div>
              </FormSection>

              <FormSection title="Location section">
                <div className="realtor-field-grid">
                  {locationFields.map((field) => (
                    <TextField field={field} key={field.label} />
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
                <p>The selected developer controls where this project appears in the public catalog hierarchy.</p>
              </div>

              <RealtorPublishingControls />
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
                  variant="wide"
                />
                <RealtorImageUpload
                  description="Interior and exterior photos shown in the public house gallery."
                  fallbackText="Gallery"
                  label="House gallery photos"
                  manageable
                  multiple
                  variant="gallery"
                />
                <RealtorImageUpload
                  description="Site development plan image shown in the public SDP section."
                  fallbackText="SDP"
                  label="SDP image"
                  variant="wide"
                />
              </div>
            </section>
          </form>
        </div>
      </section>
    </>
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
    placeholder: string;
    type?: string;
  };
}) {
  return (
    <label className="realtor-field">
      <span>{field.label}</span>
      <input placeholder={field.placeholder} type={field.type ?? "text"} />
    </label>
  );
}
