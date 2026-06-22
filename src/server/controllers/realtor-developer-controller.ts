import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { revalidateCatalogPaths } from "@/server/cache/catalog-revalidation";
import { getErrorResponse } from "@/server/errors";
import { logInfo, logWarn } from "@/server/logger";
import {
  createDeveloperForRealtor,
  deleteDeveloperForRealtor,
  updateDeveloperForRealtor
} from "@/server/services/realtor-developer-service";
import {
  createDeveloperSchema,
  deleteDeveloperSchema,
  updateDeveloperSchema
} from "@/server/validators/realtor-developer";

export async function createDeveloperController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = createDeveloperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter complete developer details." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const developer = await createDeveloperForRealtor({
      input: parsed.data,
      limits: context.limits,
      realtorId: context.realtorId
    });
    logInfo("realtor.developer.create", {
      developerId: developer.id,
      durationMs: Date.now() - startedAt,
      realtorId: context.realtorId,
      slug: developer.slug
    });
    revalidateCatalogPaths(
      [
        "/realtor/developers",
        `/realtor/developers/${developer.slug}`,
        `/developers/${developer.slug}`
      ],
      context.realtorId
    );

    return NextResponse.json(
      {
        developer,
        redirectTo: `/realtor/developers/${developer.slug}`
      },
      { status: 201 }
    );
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.developer.create_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function updateDeveloperController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = updateDeveloperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter complete developer details." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const developer = await updateDeveloperForRealtor({
      input: parsed.data,
      realtorId: context.realtorId
    });
    logInfo("realtor.developer.update", {
      developerId: developer.id,
      durationMs: Date.now() - startedAt,
      realtorId: context.realtorId,
      slug: developer.slug
    });
    revalidateCatalogPaths(
      [
        "/realtor/developers",
        `/realtor/developers/${parsed.data.slug}`,
        `/realtor/developers/${developer.slug}`,
        `/developers/${parsed.data.slug}`,
        `/developers/${developer.slug}`
      ],
      context.realtorId
    );

    return NextResponse.json({
      developer,
      redirectTo: `/realtor/developers/${developer.slug}`,
      publicUrl: `/developers/${developer.slug}`
    });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.developer.update_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function deleteDeveloperController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = deleteDeveloperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Choose a developer to delete." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const developer = await deleteDeveloperForRealtor({
      realtorId: context.realtorId,
      slug: parsed.data.slug
    });
    logInfo("realtor.developer.delete", {
      developerId: developer.id,
      durationMs: Date.now() - startedAt,
      realtorId: context.realtorId,
      slug: parsed.data.slug
    });
    revalidateCatalogPaths(
      [
        "/realtor/developers",
        `/realtor/developers/${parsed.data.slug}`,
        `/developers/${parsed.data.slug}`
      ],
      context.realtorId
    );

    return NextResponse.json({
      developer,
      redirectTo: "/realtor/developers"
    });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.developer.delete_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
