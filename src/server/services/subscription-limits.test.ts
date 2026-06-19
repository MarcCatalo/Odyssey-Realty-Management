import { describe, expect, it } from "vitest";

import { AppError } from "@/server/errors";
import {
  assertDeveloperLimit,
  assertProjectImageLimit,
  assertProjectLimit,
  type SubscriptionLimits
} from "@/server/services/subscription-limits";

const limits: SubscriptionLimits = {
  developerLimit: 6,
  projectImageLimit: 12,
  projectLimitPerDeveloper: 6
};

describe("subscription limit service", () => {
  it("allows usage below the subscription limits", () => {
    expect(() => assertDeveloperLimit({ currentDeveloperCount: 5, limits })).not.toThrow();
    expect(() => assertProjectLimit({ currentProjectCount: 5, limits })).not.toThrow();
    expect(() =>
      assertProjectImageLimit({ currentImageCount: 11, incomingImageCount: 1, limits })
    ).not.toThrow();
  });

  it("blocks developer, project, and image usage at the subscription limits", () => {
    expect(() => assertDeveloperLimit({ currentDeveloperCount: 6, limits })).toThrow(AppError);
    expect(() => assertProjectLimit({ currentProjectCount: 6, limits })).toThrow(AppError);
    expect(() =>
      assertProjectImageLimit({ currentImageCount: 12, incomingImageCount: 1, limits })
    ).toThrow(AppError);
  });

  it("allows replacing a singleton project image without consuming another image slot", () => {
    expect(() =>
      assertProjectImageLimit({ currentImageCount: 12, incomingImageCount: 0, limits })
    ).not.toThrow();
  });
});
