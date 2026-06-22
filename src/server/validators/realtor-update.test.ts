import { describe, expect, it } from "vitest";

import { updateDeveloperSchema } from "@/server/validators/realtor-developer";
import { updateProjectSchema } from "@/server/validators/realtor-project";

describe("realtor update validators", () => {
  it("requires a slug and accepts editable developer fields", () => {
    const parsed = updateDeveloperSchema.parse({
      coverage: "Quezon City",
      description: "Updated public developer positioning.",
      name: "PrimeBuild Homes",
      publicationStatus: "published",
      slug: "primebuild-homes",
      specialty: "House and lot"
    });

    expect(parsed.slug).toBe("primebuild-homes");
    expect(parsed.publicationStatus).toBe("published");
  });

  it("normalizes optional project fields when updating", () => {
    const parsed = updateProjectSchema.parse({
      completionLabel: "",
      developerSlug: "primebuild-homes",
      description: "Updated project profile for buyers to review publicly.",
      location: "Quezon City",
      priceRange: "From PHP 6M",
      projectSlug: "greenridge-villas",
      projectType: "House and lot",
      title: "Greenridge Villas",
      totalLotsAvailable: "20"
    });

    expect(parsed.completionLabel).toBeNull();
    expect(parsed.totalLotsAvailable).toBe(20);
  });
});
