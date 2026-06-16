import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { getProjectsForDeveloper } from "@/features/catalog/queries";

export default function GalleryPage() {
  const projects = getProjectsForDeveloper("primebuild-homes");

  return (
    <>
      <PageHero
        description="A consolidated view of public project visuals. Open a project card for the full gallery, SDP, location, and sales-agent contact."
        eyebrow="Gallery"
        title="Project gallery"
      />
      <section className="reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="stagger-list mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard developerSlug="primebuild-homes" key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
