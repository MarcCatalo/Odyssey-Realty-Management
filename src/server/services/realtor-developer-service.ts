import { AppError } from "@/server/errors";
import {
  countDevelopers,
  deleteDeveloper,
  findDeveloperBySlug,
  getDeveloperSlugs,
  insertDeveloper,
  updateDeveloper
} from "@/server/repositories/realtor-catalog-repository";
import { createUniqueSlug } from "@/server/services/slug";
import { assertDeveloperLimit, type SubscriptionLimits } from "@/server/services/subscription-limits";
import type { CreateDeveloperInput, UpdateDeveloperInput } from "@/server/validators/realtor-developer";

export async function createDeveloperForRealtor({
  input,
  limits,
  realtorId
}: {
  input: CreateDeveloperInput;
  limits: SubscriptionLimits;
  realtorId: string;
}) {
  const currentDeveloperCount = await countDevelopers(realtorId);

  assertDeveloperLimit({ currentDeveloperCount, limits });

  const existingSlugs = await getDeveloperSlugs(realtorId);
  const slug = createUniqueSlug(input.name, existingSlugs);

  try {
    return await insertDeveloper({ input, realtorId, slug });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Developer could not be created.");
  }
}

export async function updateDeveloperForRealtor({
  input,
  realtorId
}: {
  input: UpdateDeveloperInput;
  realtorId: string;
}) {
  const developer = await findDeveloperBySlug(realtorId, input.slug);

  if (!developer) {
    throw new AppError("Developer could not be found.", 404);
  }

  const existingSlugs = (await getDeveloperSlugs(realtorId)).filter((slug) => slug !== input.slug);
  const slug = createUniqueSlug(input.name, existingSlugs);

  return updateDeveloper({ input, realtorId, slug });
}

export async function deleteDeveloperForRealtor({
  realtorId,
  slug
}: {
  realtorId: string;
  slug: string;
}) {
  const developer = await findDeveloperBySlug(realtorId, slug);

  if (!developer) {
    throw new AppError("Developer could not be found.", 404);
  }

  return deleteDeveloper({ realtorId, slug });
}
