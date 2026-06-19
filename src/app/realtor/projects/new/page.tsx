import { RealtorNewProjectForm } from "@/components/realtor-new-project-form";
import { developers } from "@/features/catalog/data";

type NewProjectPageProps = {
  searchParams?: {
    developer?: string;
  };
};

export default function NewProjectPage({ searchParams }: NewProjectPageProps) {
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

      <RealtorNewProjectForm developers={developers} selectedDeveloperSlug={searchParams?.developer} />
    </>
  );
}
