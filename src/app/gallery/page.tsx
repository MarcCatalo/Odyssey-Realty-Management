import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { getPublicCatalog } from "@/features/catalog/live-queries";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const catalog = await getPublicCatalog();
  const projects = catalog.projects
    .filter((project) => project.publicationStatus === "published")
    .map((project) => ({
      project,
      developer: catalog.developers.find((developer) => developer.id === project.developerId)
    }))
    .filter((item) => item.developer);

  return (
    <>
      <PageHero
        description="A consolidated view of public project visuals. Open a project card for the full gallery, SDP, location, and sales-agent contact."
        eyebrow="Gallery"
        title="Project gallery"
      />
      <section className="reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="stagger-list mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {projects.map(({ developer, project }) => (
            <ProjectCard developerSlug={developer!.slug} key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
