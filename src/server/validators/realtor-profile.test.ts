import { describe, expect, it } from "vitest";

import { updateRealtorProfileSchema } from "@/server/validators/realtor-profile";

const validProfile = {
  businessName: "  Meridian Realty Partners  ",
  email: " sales@example.com ",
  headerMain: "  Developer Catalog  ",
  headerPrimarySubheader: "  Agent-curated. Not a marketplace.  ",
  headerSecondarySubheader: "  Browse published homes from trusted developer partners.  ",
  phone: " +63 917 000 0000 ",
  socials: {
    facebook: "https://facebook.com/meridian",
    instagram: "",
    linkedin: null,
    website: "https://meridian.example"
  },
  title: "  Licensed Real Estate Agent  "
};

describe("realtor profile validator", () => {
  it("trims required profile and website-header fields", () => {
    const parsed = updateRealtorProfileSchema.parse(validProfile);

    expect(parsed.businessName).toBe("Meridian Realty Partners");
    expect(parsed.email).toBe("sales@example.com");
    expect(parsed.headerMain).toBe("Developer Catalog");
    expect(parsed.phone).toBe("+63 917 000 0000");
    expect(parsed.title).toBe("Licensed Real Estate Agent");
  });

  it("normalizes empty optional social links", () => {
    const parsed = updateRealtorProfileSchema.parse(validProfile);

    expect(parsed.socials.instagram).toBeNull();
    expect(parsed.socials.linkedin).toBeNull();
    expect(parsed.socials.facebook).toBe("https://facebook.com/meridian");
  });

  it("rejects non-http social links", () => {
    const result = updateRealtorProfileSchema.safeParse({
      ...validProfile,
      socials: {
        ...validProfile.socials,
        website: "javascript:alert(1)"
      }
    });

    expect(result.success).toBe(false);
  });

  it("does not accept a client-provided catalog slug", () => {
    const parsed = updateRealtorProfileSchema.parse({
      ...validProfile,
      catalogSlug: "another-realtor"
    });

    expect("catalogSlug" in parsed).toBe(false);
  });
});
