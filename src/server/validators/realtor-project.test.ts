import { describe, expect, it } from "vitest";

import { createProjectSchema } from "@/server/validators/realtor-project";

const validProject = {
  developerSlug: "primebuild-homes",
  description: "A complete project description for prospective property buyers.",
  location: "Quezon City",
  projectType: "House and lot",
  title: "Greenridge Villas"
};

describe("realtor project validator", () => {
  it("normalizes an ordered optional amenities list", () => {
    const parsed = createProjectSchema.parse({
      ...validProject,
      featuresAmenities: ["  Clubhouse  ", "", "24/7 security", "Swimming pool"]
    });

    expect(parsed.featuresAmenities).toEqual([
      "Clubhouse",
      "24/7 security",
      "Swimming pool"
    ]);
  });

  it("defaults amenities to an empty list", () => {
    const parsed = createProjectSchema.parse(validProject);

    expect(parsed.featuresAmenities).toEqual([]);
  });

  it("rejects more than thirty amenities", () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      featuresAmenities: Array.from({ length: 31 }, (_, index) => `Amenity ${index + 1}`)
    });

    expect(result.success).toBe(false);
  });

  it("rejects amenity labels longer than 120 characters", () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      featuresAmenities: ["A".repeat(121)]
    });

    expect(result.success).toBe(false);
  });
});
