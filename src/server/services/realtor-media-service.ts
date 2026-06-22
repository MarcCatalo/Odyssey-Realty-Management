import { randomUUID } from "crypto";

import { AppError } from "@/server/errors";
import {
  attachProjectMedia,
  countProjectImages,
  deleteProjectMedia,
  findDeveloperBySlug,
  findProjectMediaForRealtor,
  findProjectForRealtor,
  insertMediaAsset,
  projectHasMediaRole,
  updateDeveloperLogoAsset,
  updateProjectMediaLabel,
  uploadObject
} from "@/server/repositories/realtor-catalog-repository";
import { assertProjectImageLimit, type SubscriptionLimits } from "@/server/services/subscription-limits";
import type {
  DeleteProjectMediaInput,
  UpdateProjectMediaInput,
  UploadDeveloperLogoInput,
  UploadProjectMediaInput
} from "@/server/validators/realtor-media";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const OUTPUT_MIME_TYPE = "image/webp";
const OUTPUT_EXTENSION = "webp";
const WEBP_QUALITY = 86;
const MAX_IMAGE_DIMENSION = 1800;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadProjectMediaForRealtor({
  file,
  input,
  limits,
  realtorId
}: {
  file: File;
  input: UploadProjectMediaInput;
  limits: SubscriptionLimits;
  realtorId: string;
}) {
  validateImageFile(file);

  const project = await findProjectForRealtor(realtorId, input.projectId);

  if (!project) {
    throw new AppError("Choose a valid project for this realtor account.", 404);
  }

  const currentImageCount = await countProjectImages(input.projectId);
  const isReplacingSingleton =
    (input.role === "project_cover" || input.role === "project_sdp") &&
    (await projectHasMediaRole(input.projectId, input.role));

  assertProjectImageLimit({
    currentImageCount,
    incomingImageCount: isReplacingSingleton ? 0 : 1,
    limits
  });

  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const compressed = await compressImage(originalBuffer, file.type);
  const storagePath = [
    "realtors",
    realtorId,
    "projects",
    input.projectId,
    input.role,
    `${randomUUID()}.${compressed.extension}`
  ].join("/");

  await uploadObject({
    contentType: compressed.mimeType,
    data: compressed.buffer,
    path: storagePath
  });

  const mediaAsset = await insertMediaAsset({
    altText: input.altText,
    bucket: "realtor-media",
    caption: input.caption,
    fileSizeBytes: compressed.buffer.byteLength,
    height: compressed.height,
    mimeType: compressed.mimeType,
    originalFilename: file.name,
    realtorId,
    storagePath,
    width: compressed.width
  });

  const projectMedia = await attachProjectMedia({
    altText: input.altText,
    caption: input.caption,
    mediaAssetId: mediaAsset.id,
    projectId: input.projectId,
    role: input.role
  });

  return {
    mediaAsset,
    projectMedia
  };
}

export async function uploadDeveloperLogoForRealtor({
  file,
  input,
  realtorId
}: {
  file: File;
  input: UploadDeveloperLogoInput;
  realtorId: string;
}) {
  validateImageFile(file);

  const developer = await findDeveloperBySlug(realtorId, input.developerSlug);

  if (!developer) {
    throw new AppError("Choose a valid developer for this realtor account.", 404);
  }

  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const compressed = await compressImage(originalBuffer, file.type);
  const storagePath = [
    "realtors",
    realtorId,
    "developers",
    developer.id,
    "logo",
    `${randomUUID()}.${compressed.extension}`
  ].join("/");

  await uploadObject({
    contentType: compressed.mimeType,
    data: compressed.buffer,
    path: storagePath
  });

  const mediaAsset = await insertMediaAsset({
    altText: input.altText,
    bucket: "realtor-media",
    caption: input.caption,
    fileSizeBytes: compressed.buffer.byteLength,
    height: compressed.height,
    mimeType: compressed.mimeType,
    originalFilename: file.name,
    realtorId,
    storagePath,
    width: compressed.width
  });

  const developerWithLogo = await updateDeveloperLogoAsset({
    developerId: developer.id,
    mediaAssetId: mediaAsset.id,
    realtorId
  });

  return {
    developer: developerWithLogo,
    mediaAsset
  };
}

export async function updateProjectMediaForRealtor({
  input,
  realtorId
}: {
  input: UpdateProjectMediaInput;
  realtorId: string;
}) {
  const projectMedia = await findProjectMediaForRealtor(realtorId, input.projectMediaId);

  if (!projectMedia) {
    throw new AppError("Project media could not be found.", 404);
  }

  return updateProjectMediaLabel({
    altText: input.altText,
    caption: input.caption,
    projectMediaId: input.projectMediaId
  });
}

export async function deleteProjectMediaForRealtor({
  input,
  realtorId
}: {
  input: DeleteProjectMediaInput;
  realtorId: string;
}) {
  const projectMedia = await findProjectMediaForRealtor(realtorId, input.projectMediaId);

  if (!projectMedia) {
    throw new AppError("Project media could not be found.", 404);
  }

  return deleteProjectMedia(input.projectMediaId);
}

async function compressImage(input: Buffer, originalMimeType: string) {
  const sharp = await loadSharp();

  if (!sharp) {
    return {
      buffer: input,
      extension: getExtensionForMimeType(originalMimeType),
      height: undefined,
      mimeType: originalMimeType,
      width: undefined
    };
  }

  const image = sharp(input, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const shouldResize =
    (metadata.width ?? 0) > MAX_IMAGE_DIMENSION || (metadata.height ?? 0) > MAX_IMAGE_DIMENSION;

  const pipeline = shouldResize
    ? image.resize({
        height: MAX_IMAGE_DIMENSION,
        width: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true
      })
    : image;

  const { data, info } = await pipeline
    .webp({
      quality: WEBP_QUALITY,
      effort: 4
    })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    extension: OUTPUT_EXTENSION,
    height: info.height,
    mimeType: OUTPUT_MIME_TYPE,
    width: info.width
  };
}

async function loadSharp() {
  try {
    const sharpModule = await import("sharp");

    return sharpModule.default;
  } catch {
    return null;
  }
}

function getExtensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new AppError("Upload a JPG, PNG, or WebP image.", 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new AppError("Images must be 5 MB or smaller before upload.", 413);
  }
}
