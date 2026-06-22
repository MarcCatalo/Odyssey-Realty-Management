import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { revalidateCatalogPaths } from "@/server/cache/catalog-revalidation";
import { getErrorResponse } from "@/server/errors";
import { logInfo, logWarn } from "@/server/logger";
import {
  createProjectForRealtor,
  deleteProjectForRealtor,
  updateProjectForRealtor
} from "@/server/services/realtor-project-service";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema
} from "@/server/validators/realtor-project";

export async function createProjectController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter complete project details." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const project = await createProjectForRealtor({
      input: parsed.data,
      limits: context.limits,
      realtorId: context.realtorId
    });
    logInfo("realtor.project.create", {
      developerSlug: parsed.data.developerSlug,
      durationMs: Date.now() - startedAt,
      projectId: project.id,
      realtorId: context.realtorId,
      slug: project.slug
    });
    revalidateCatalogPaths(
      [
        `/realtor/developers/${parsed.data.developerSlug}`,
        `/realtor/developers/${parsed.data.developerSlug}/projects/${project.slug}`,
        `/developers/${parsed.data.developerSlug}`,
        `/developers/${parsed.data.developerSlug}/projects/${project.slug}`
      ],
      context.realtorId
    );

    return NextResponse.json(
      {
        project,
        redirectTo: `/realtor/developers/${parsed.data.developerSlug}/projects/${project.slug}`
      },
      { status: 201 }
    );
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.project.create_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function updateProjectController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter complete project details." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const project = await updateProjectForRealtor({
      input: parsed.data,
      realtorId: context.realtorId
    });
    logInfo("realtor.project.update", {
      developerSlug: parsed.data.developerSlug,
      durationMs: Date.now() - startedAt,
      projectId: project.id,
      realtorId: context.realtorId,
      slug: project.slug
    });
    revalidateCatalogPaths(
      [
        `/realtor/developers/${parsed.data.currentDeveloperSlug ?? parsed.data.developerSlug}`,
        `/realtor/developers/${parsed.data.developerSlug}`,
        `/realtor/developers/${parsed.data.developerSlug}/projects/${project.slug}`,
        `/developers/${parsed.data.currentDeveloperSlug ?? parsed.data.developerSlug}`,
        `/developers/${parsed.data.developerSlug}`,
        `/developers/${parsed.data.developerSlug}/projects/${parsed.data.projectSlug}`,
        `/developers/${parsed.data.developerSlug}/projects/${project.slug}`
      ],
      context.realtorId
    );

    return NextResponse.json({
      project,
      redirectTo: `/realtor/developers/${parsed.data.developerSlug}/projects/${project.slug}`,
      publicUrl: `/developers/${parsed.data.developerSlug}/projects/${project.slug}`
    });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.project.update_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}

export async function deleteProjectController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = deleteProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Choose a project to delete." }, { status: 400 });
    }

    const context = await getRealtorContext();
    const project = await deleteProjectForRealtor({
      developerSlug: parsed.data.developerSlug,
      projectSlug: parsed.data.projectSlug,
      realtorId: context.realtorId
    });
    logInfo("realtor.project.delete", {
      developerSlug: parsed.data.developerSlug,
      durationMs: Date.now() - startedAt,
      projectId: project.id,
      realtorId: context.realtorId,
      slug: parsed.data.projectSlug
    });
    revalidateCatalogPaths(
      [
        `/realtor/developers/${parsed.data.developerSlug}`,
        `/realtor/developers/${parsed.data.developerSlug}/projects/${parsed.data.projectSlug}`,
        `/developers/${parsed.data.developerSlug}`,
        `/developers/${parsed.data.developerSlug}/projects/${parsed.data.projectSlug}`
      ],
      context.realtorId
    );

    return NextResponse.json({
      project,
      redirectTo: `/realtor/developers/${parsed.data.developerSlug}`
    });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.project.delete_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
