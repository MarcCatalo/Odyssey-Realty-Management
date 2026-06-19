import { describe, expect, it } from "vitest";

import { createSlug, createUniqueSlug } from "@/server/services/slug";

describe("slug service", () => {
  it("normalizes names into URL-safe slugs", () => {
    expect(createSlug(" PrimeBuild Homes! ")).toBe("primebuild-homes");
    expect(createSlug("Cavite & Laguna Projects")).toBe("cavite-laguna-projects");
  });

  it("creates unique slugs when a realtor already has the base slug", () => {
    expect(createUniqueSlug("PrimeBuild Homes", ["primebuild-homes"])).toBe("primebuild-homes-2");
    expect(createUniqueSlug("PrimeBuild Homes", ["primebuild-homes", "primebuild-homes-2"])).toBe(
      "primebuild-homes-3"
    );
  });
});
