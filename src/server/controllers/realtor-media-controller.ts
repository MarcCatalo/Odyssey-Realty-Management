import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { revalidateCatalogPaths } from "@/server/cache/catalog-revalidation";
import { getErrorResponse } from "@/server/errors";
import { logInfo, logWarn } from "@/server/logger";
import {
  deleteProjectMediaForRealtor,
  updateProjectMediaForRealtor,
  uploadDeveloperLogoForRealtor,
  uploadProjectMediaForRealtor
} from "@/server/services/realtor-media-service";
import {
  deleteProjectMediaSchema,
  uploadDeveloperLogoSchema,
  updateProjectMediaSchema,
  uploadProjectMediaSchema
} from "@/server/validators/realtor-media";

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function" &&
    "size" in value &&
    "type" in value
  );
}

export async function updateProjectMediaController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = updateProjectMediaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter a valid photo name." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const media = await updateProjectMediaForRealtor({
      input: parsed.data,
      realtorId: context.realtorId
    });
    logInfo("realtor.media.update", {
      durationMs: Date.now() - startedAt,
      projectMediaId: media.id,
      realtorId: context.realtorId,
      role: media.role
    });
    revalidateCatalogPaths([], context.realtorId);

    return NextResponse.json({ media });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.media.update_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function deleteProjectMediaController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = deleteProjectMediaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Choose a photo to delete." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const media = await deleteProjectMediaForRealtor({
      input: parsed.data,
      realtorId: context.realtorId
    });
    logInfo("realtor.media.delete", {
      durationMs: Date.now() - startedAt,
      projectMediaId: media.id,
      realtorId: context.realtorId,
      role: media.role
    });
    revalidateCatalogPaths([], context.realtorId);

    return NextResponse.json({ media });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.media.delete_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function uploadProjectMediaController(request: Request) {
  const startedAt = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!isUploadFile(file)) {
      return NextResponse.json({ message: "Choose an image to upload." }, { status: 400 });
    }

    const role = formData.get("role");
    const uploadPayload = {
      altText: formData.get("altText") || undefined,
      caption: formData.get("caption") || undefined,
      developerSlug: formData.get("developerSlug"),
      projectId: formData.get("projectId"),
      role
    };
    const developerLogoParsed = uploadDeveloperLogoSchema.safeParse(uploadPayload);

    if (developerLogoParsed.success) {
      const context = await getRealtorContext();
      const media = await uploadDeveloperLogoForRealtor({
        file,
        input: developerLogoParsed.data,
        realtorId: context.realtorId
      });
      logInfo("realtor.media.upload_logo", {
        developerSlug: developerLogoParsed.data.developerSlug,
        durationMs: Date.now() - startedAt,
        realtorId: context.realtorId
      });
      revalidateCatalogPaths([], context.realtorId);

      return NextResponse.json({ media }, { status: 201 });
    }

    const parsed = uploadProjectMediaSchema.safeParse({
      projectId: formData.get("projectId"),
      role,
      altText: formData.get("altText") || undefined,
      caption: formData.get("caption") || undefined
    });

    if (!parsed.success) {
      return NextResponse.json({ message: "Upload details are incomplete." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const media = await uploadProjectMediaForRealtor({
      file,
      input: parsed.data,
      limits: context.limits,
      realtorId: context.realtorId
    });
    logInfo("realtor.media.upload_project", {
      durationMs: Date.now() - startedAt,
      projectId: parsed.data.projectId,
      projectMediaId: media.projectMedia.id,
      realtorId: context.realtorId,
      role: parsed.data.role
    });
    revalidateCatalogPaths([], context.realtorId);

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Project media upload failed", error);
    }

    const response = getErrorResponse(error);
    logWarn("realtor.media.upload_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
