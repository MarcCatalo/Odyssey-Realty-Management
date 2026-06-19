import { z } from "zod";

export const createDeveloperSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(120),
  coverage: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(1200),
  publicationStatus: z.enum(["draft", "published"]).default("draft")
});

export type CreateDeveloperInput = z.infer<typeof createDeveloperSchema>;
