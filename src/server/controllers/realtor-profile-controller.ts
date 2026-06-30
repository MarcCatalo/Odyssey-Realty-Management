import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { revalidateCatalogPaths } from "@/server/cache/catalog-revalidation";
import { getErrorResponse } from "@/server/errors";
import { logInfo, logWarn } from "@/server/logger";
import { updateProfileForRealtor } from "@/server/services/realtor-profile-service";
import { updateRealtorProfileSchema } from "@/server/validators/realtor-profile";

export async function updateRealtorProfileController(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json().catch(() => null);
    const parsed = updateRealtorProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Check the required profile details and social links." },
        { status: 400 }
      );
    }

    const context = await getRealtorContext();
    const profile = await updateProfileForRealtor({
      input: parsed.data,
      realtorId: context.realtorId
    });

    revalidateCatalogPaths(["/realtor/contact", "/contact"], context.realtorId);
    logInfo("realtor.profile.update", {
      durationMs: Date.now() - startedAt,
      realtorId: context.realtorId
    });

    return NextResponse.json({ profile });
  } catch (error) {
    const response = getErrorResponse(error);
    logWarn("realtor.profile.update_failed", {
      durationMs: Date.now() - startedAt,
      status: response.status
    });

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
