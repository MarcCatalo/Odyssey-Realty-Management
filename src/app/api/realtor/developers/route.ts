import {
  createDeveloperController,
  deleteDeveloperController,
  updateDeveloperController
} from "@/server/controllers/realtor-developer-controller";

export async function POST(request: Request) {
  return createDeveloperController(request);
}

export async function PATCH(request: Request) {
  return updateDeveloperController(request);
}

export async function DELETE(request: Request) {
  return deleteDeveloperController(request);
}
