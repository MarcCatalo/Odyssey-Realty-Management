import { z } from "zod";

export const uploadProjectMediaSchema = z.object({
  projectId: z.string().uuid(),
  role: z.enum(["project_cover", "project_gallery", "project_sdp"]),
  altText: z.string().trim().max(180).optional(),
  caption: z.string().trim().max(180).optional()
});

export type UploadProjectMediaInput = z.infer<typeof uploadProjectMediaSchema>;
