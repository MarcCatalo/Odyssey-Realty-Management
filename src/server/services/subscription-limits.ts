import { AppError } from "@/server/errors";

export type SubscriptionLimits = {
  developerLimit: number;
  projectLimitPerDeveloper: number;
  projectImageLimit: number;
};

export function assertDeveloperLimit({
  currentDeveloperCount,
  limits
}: {
  currentDeveloperCount: number;
  limits: SubscriptionLimits;
}) {
  if (currentDeveloperCount >= limits.developerLimit) {
    throw new AppError(
      `This subscription can publish up to ${limits.developerLimit} developers.`,
      403
    );
  }
}

export function assertProjectLimit({
  currentProjectCount,
  limits
}: {
  currentProjectCount: number;
  limits: SubscriptionLimits;
}) {
  if (currentProjectCount >= limits.projectLimitPerDeveloper) {
    throw new AppError(
      `This subscription can publish up to ${limits.projectLimitPerDeveloper} projects per developer.`,
      403
    );
  }
}

export function assertProjectImageLimit({
  currentImageCount,
  incomingImageCount,
  limits
}: {
  currentImageCount: number;
  incomingImageCount: number;
  limits: SubscriptionLimits;
}) {
  if (currentImageCount + incomingImageCount > limits.projectImageLimit) {
    throw new AppError(
      `This subscription can store up to ${limits.projectImageLimit} images per project.`,
      403
    );
  }
}
