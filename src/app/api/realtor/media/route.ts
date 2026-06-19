import { uploadProjectMediaController } from "@/server/controllers/realtor-media-controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return uploadProjectMediaController(request);
}
