import {
  deleteProjectMediaController,
  updateProjectMediaController,
  uploadProjectMediaController
} from "@/server/controllers/realtor-media-controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return uploadProjectMediaController(request);
}

export async function PATCH(request: Request) {
  return updateProjectMediaController(request);
}

export async function DELETE(request: Request) {
  return deleteProjectMediaController(request);
}
