import { createProjectController } from "@/server/controllers/realtor-project-controller";

export async function POST(request: Request) {
  return createProjectController(request);
}
