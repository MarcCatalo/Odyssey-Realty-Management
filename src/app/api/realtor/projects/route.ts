import {
  createProjectController,
  deleteProjectController,
  updateProjectController
} from "@/server/controllers/realtor-project-controller";

export async function POST(request: Request) {
  return createProjectController(request);
}

export async function PATCH(request: Request) {
  return updateProjectController(request);
}

export async function DELETE(request: Request) {
  return deleteProjectController(request);
}
