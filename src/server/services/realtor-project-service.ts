import { AppError } from "@/server/errors";
import {
  archiveProject,
  countProjectsForDeveloper,
  findDeveloperBySlug,
  findProjectBySlugs,
  getProjectSlugs,
  insertProject,
  updateProject
} from "@/server/repositories/realtor-catalog-repository";
import { createUniqueSlug } from "@/server/services/slug";
import { assertProjectLimit, type SubscriptionLimits } from "@/server/services/subscription-limits";
import type { CreateProjectInput, UpdateProjectInput } from "@/server/validators/realtor-project";

export async function createProjectForRealtor({
  input,
  limits,
  realtorId
}: {
  input: CreateProjectInput;
  limits: SubscriptionLimits;
  realtorId: string;
}) {
  const developer = await findDeveloperBySlug(realtorId, input.developerSlug);

  if (!developer) {
    throw new AppError("Choose a valid developer for this realtor account.", 404);
  }

  const currentProjectCount = await countProjectsForDeveloper(developer.id);

  assertProjectLimit({ currentProjectCount, limits });

  const existingSlugs = await getProjectSlugs(developer.id);
  const slug = createUniqueSlug(input.title, existingSlugs);

  return insertProject({
    developerId: developer.id,
    input,
    realtorId,
    slug
  });
}

export async function updateProjectForRealtor({
  input,
  realtorId
}: {
  input: UpdateProjectInput;
  realtorId: string;
}) {
  const existingProject = await findProjectBySlugs(
    realtorId,
    input.currentDeveloperSlug ?? input.developerSlug,
    input.projectSlug
  );

  if (!existingProject) {
    throw new AppError("Project could not be found.", 404);
  }

  const targetDeveloper = await findDeveloperBySlug(realtorId, input.developerSlug);

  if (!targetDeveloper) {
    throw new AppError("Choose a valid developer for this realtor account.", 404);
  }

  const existingSlugs = (await getProjectSlugs(targetDeveloper.id)).filter(
    (slug) => slug !== input.projectSlug
  );
  const slug = createUniqueSlug(input.title, existingSlugs);

  return updateProject({
    developerId: targetDeveloper.id,
    input,
    projectId: existingProject.id,
    realtorId,
    slug
  });
}

export async function deleteProjectForRealtor({
  developerSlug,
  projectSlug,
  realtorId
}: {
  developerSlug: string;
  projectSlug: string;
  realtorId: string;
}) {
  const existingProject = await findProjectBySlugs(realtorId, developerSlug, projectSlug);

  if (!existingProject) {
    throw new AppError("Project could not be found.", 404);
  }

  return archiveProject({
    projectId: existingProject.id,
    realtorId
  });
}
