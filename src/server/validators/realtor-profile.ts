import { z } from "zod";

const optionalHttpUrl = z
  .union([z.string().trim().max(500), z.null(), z.undefined()])
  .transform((value) => (value ? value : null))
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid HTTP or HTTPS URL.");

export const updateRealtorProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  headerMain: z.string().trim().min(2).max(120),
  headerPrimarySubheader: z.string().trim().min(2).max(180),
  headerSecondarySubheader: z.string().trim().min(2).max(500),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(40)
    .regex(/^[+0-9()\-\s]+$/, "Enter a valid contact number."),
  socials: z
    .object({
      facebook: optionalHttpUrl,
      instagram: optionalHttpUrl,
      linkedin: optionalHttpUrl,
      website: optionalHttpUrl
    })
    .default({
      facebook: null,
      instagram: null,
      linkedin: null,
      website: null
    }),
  title: z.string().trim().min(2).max(120)
});

export type UpdateRealtorProfileInput = z.infer<typeof updateRealtorProfileSchema>;
