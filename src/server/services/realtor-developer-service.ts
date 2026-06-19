import { AppError } from "@/server/errors";
import {
  countDevelopers,
  getDeveloperSlugs,
  insertDeveloper
} from "@/server/repositories/realtor-catalog-repository";
import { createUniqueSlug } from "@/server/services/slug";
import { assertDeveloperLimit, type SubscriptionLimits } from "@/server/services/subscription-limits";
import type { CreateDeveloperInput } from "@/server/validators/realtor-developer";

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
