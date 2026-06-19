import { AppError } from "@/server/errors";
import {
  countProjectsForDeveloper,
  findDeveloperBySlug,
  getProjectSlugs,
  insertProject
} from "@/server/repositories/realtor-catalog-repository";
import { createUniqueSlug } from "@/server/services/slug";
import { assertProjectLimit, type SubscriptionLimits } from "@/server/services/subscription-limits";
import type { CreateProjectInput } from "@/server/validators/realtor-project";

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
