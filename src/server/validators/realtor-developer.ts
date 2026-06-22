import { z } from "zod";

export const createDeveloperSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(120),
  coverage: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(1200),
  publicationStatus: z.enum(["draft", "published", "archived"]).default("draft")
});

export const updateDeveloperSchema = createDeveloperSchema.extend({
  slug: z.string().trim().min(1).max(120)
});

export const deleteDeveloperSchema = z.object({
  slug: z.string().trim().min(1).max(120)
});

export type CreateDeveloperInput = z.infer<typeof createDeveloperSchema>;
export type UpdateDeveloperInput = z.infer<typeof updateDeveloperSchema>;
export type DeleteDeveloperInput = z.infer<typeof deleteDeveloperSchema>;
