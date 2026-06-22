import { z } from "zod";

const optionalText = (max = 180) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

export const createProjectSchema = z.object({
  developerSlug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(1600),
  location: z.string().trim().min(2).max(180),
  projectType: z.string().trim().min(2).max(120),
  statusLabel: optionalText(),
  priceRange: optionalText(),
  totalLotsAvailable: z.coerce.number().int().min(0).nullable().optional(),
  levels: optionalText(80),
  lotSizeRange: optionalText(120),
  completionLabel: optionalText(120),
  mapAddress: optionalText(240),
  googleMapsUrl: optionalText(500),
  totalSiteArea: optionalText(120),
  roadReserve: optionalText(120),
  commonZones: optionalText(120),
  zoning: optionalText(160),
  sdpReference: optionalText(160),
  publicationStatus: z.enum(["draft", "published", "archived"]).default("draft")
});

export const updateProjectSchema = createProjectSchema.extend({
  currentDeveloperSlug: z.string().trim().min(1).max(120).optional(),
  projectSlug: z.string().trim().min(1).max(160)
});

export const deleteProjectSchema = z.object({
  developerSlug: z.string().trim().min(1).max(120),
  projectSlug: z.string().trim().min(1).max(160)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
