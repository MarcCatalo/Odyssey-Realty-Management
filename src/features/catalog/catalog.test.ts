import { describe, expect, it } from "vitest";

import {
  getDeveloperBySlug,
  getProjectBySlugs,
  getProjectRoute,
  getPublicContactForProject
} from "./queries";

describe("catalog public routing", () => {
  it("finds a developer by slug", () => {
    const developer = getDeveloperBySlug("primebuild-homes");

    expect(developer?.name).toBe("PrimeBuild Homes");
    expect(developer?.contactLinks.length).toBeGreaterThan(0);
  });

  it("requires the developer slug when resolving a project", () => {
    const project = getProjectBySlugs("primebuild-homes", "greenridge-villas");

    expect(project?.title).toBe("Greenridge Villas");
    expect(getProjectRoute("primebuild-homes", "greenridge-villas")).toBe(
      "/developers/primebuild-homes/projects/greenridge-villas"
    );
  });

  it("uses sales-agent contact details for project pages by default", () => {
    const contact = getPublicContactForProject("primebuild-homes", "greenridge-villas");

    expect(contact.owner).toBe("sales-agent");
    expect(contact.links.map((link) => link.type)).toContain("phone");
  });
});
