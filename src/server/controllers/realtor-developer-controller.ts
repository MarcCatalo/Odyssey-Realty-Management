import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { getErrorResponse } from "@/server/errors";
import { createDeveloperForRealtor } from "@/server/services/realtor-developer-service";
import { createDeveloperSchema } from "@/server/validators/realtor-developer";

export async function createDeveloperController(request: Request) {
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

    return NextResponse.json(
      {
        developer,
        redirectTo: `/realtor/developers/${developer.slug}`
      },
      { status: 201 }
    );
  } catch (error) {
    const response = getErrorResponse(error);

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
