import { z } from "zod";

export const uploadProjectMediaSchema = z.object({
  projectId: z.string().uuid(),
  role: z.enum(["project_cover", "project_gallery", "project_sdp"]),
  altText: z.string().trim().max(180).optional(),
  caption: z.string().trim().max(180).optional()
});

export const uploadDeveloperLogoSchema = z.object({
  developerSlug: z.string().trim().min(1).max(120),
  role: z.literal("developer_logo"),
  altText: z.string().trim().max(180).optional(),
  caption: z.string().trim().max(180).optional()
});

export const updateProjectMediaSchema = z.object({
  altText: z.string().trim().max(180).optional(),
  caption: z.string().trim().min(1).max(180),
  projectMediaId: z.string().uuid()
});

export const deleteProjectMediaSchema = z.object({
  projectMediaId: z.string().uuid()
});

export type UploadProjectMediaInput = z.infer<typeof uploadProjectMediaSchema>;
export type UploadDeveloperLogoInput = z.infer<typeof uploadDeveloperLogoSchema>;
export type UpdateProjectMediaInput = z.infer<typeof updateProjectMediaSchema>;
export type DeleteProjectMediaInput = z.infer<typeof deleteProjectMediaSchema>;
