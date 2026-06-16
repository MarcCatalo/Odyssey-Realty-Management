import { developers, projects, salesAgent } from "./data";
import type { Developer, Project, PublicContactBundle } from "./types";

const published = <T extends { status?: string; publicationStatus?: string }>(item: T): boolean =>
  item.status === "published" || item.publicationStatus === "published";

export function getPublishedDevelopers(): Developer[] {
  return developers.filter(published);
}

export function getDeveloperBySlug(slug: string): Developer | undefined {
  return getPublishedDevelopers().find((developer) => developer.slug === slug);
}

export function getProjectsForDeveloper(developerSlug: string): Project[] {
  const developer = getDeveloperBySlug(developerSlug);

  if (!developer) {
    return [];
  }

  return projects.filter(
    (project) => project.developerId === developer.id && project.publicationStatus === "published"
  );
}

export function getProjectBySlugs(developerSlug: string, projectSlug: string): Project | undefined {
  return getProjectsForDeveloper(developerSlug).find((project) => project.slug === projectSlug);
}

export function getProjectRoute(developerSlug: string, projectSlug: string): string {
  return `/developers/${developerSlug}/projects/${projectSlug}`;
}

export function getDeveloperRoute(developerSlug: string): string {
  return `/developers/${developerSlug}`;
}

export function getPublicContactForProject(
  developerSlug: string,
  projectSlug: string
): PublicContactBundle {
  const project = getProjectBySlugs(developerSlug, projectSlug);

  if (!project) {
    throw new Error(`Project not found: ${developerSlug}/${projectSlug}`);
  }

  return {
    owner: "sales-agent",
    name: salesAgent.name,
    links: salesAgent.contactLinks.filter((link) => link.isEnabled)
  };
}

export function getDeveloperContact(developerSlug: string): PublicContactBundle | undefined {
  const developer = getDeveloperBySlug(developerSlug);

  if (!developer) {
    return undefined;
  }

  return {
    owner: "developer",
    name: developer.name,
    links: developer.contactLinks.filter((link) => link.isEnabled)
  };
}
