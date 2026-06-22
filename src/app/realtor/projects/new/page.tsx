import { RealtorNewProjectForm } from "@/components/realtor-new-project-form";
import { getCatalogForRealtorId } from "@/features/catalog/live-queries";
import { requireRealtorContextForPage } from "@/server/auth/realtor-session";

type NewProjectPageProps = {
  searchParams?: {
    developer?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const context = await requireRealtorContextForPage();
  const catalog = await getCatalogForRealtorId(context.realtorId);

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

      <RealtorNewProjectForm developers={catalog.developers} selectedDeveloperSlug={searchParams?.developer} />
    </>
  );
}
