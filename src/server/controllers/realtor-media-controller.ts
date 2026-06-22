import { NextResponse } from "next/server";

import { getRealtorContext } from "@/server/auth/realtor-session";
import { revalidateCatalogPaths } from "@/server/cache/catalog-revalidation";
import { getErrorResponse } from "@/server/errors";
import { uploadProjectMediaForRealtor } from "@/server/services/realtor-media-service";
import { uploadProjectMediaSchema } from "@/server/validators/realtor-media";

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

export async function uploadProjectMediaController(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!isUploadFile(file)) {
      return NextResponse.json({ message: "Choose an image to upload." }, { status: 400 });
    }

    const parsed = uploadProjectMediaSchema.safeParse({
      projectId: formData.get("projectId"),
      role: formData.get("role"),
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
    revalidateCatalogPaths([], context.realtorId);

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Project media upload failed", error);
    }

    const response = getErrorResponse(error);

    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
