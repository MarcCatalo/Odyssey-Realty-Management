import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { getErrorResponse } from "@/server/errors";
import { createProjectForRealtor } from "@/server/services/realtor-project-service";
import { createProjectSchema } from "@/server/validators/realtor-project";

export async function createProjectController(request: Request) {
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

    return NextResponse.json(
      {
        project,
        redirectTo: `/realtor/developers/${parsed.data.developerSlug}/projects/${project.slug}`
      },
      { status: 201 }
    );
  } catch (error) {
    const response = getErrorResponse(error);

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
