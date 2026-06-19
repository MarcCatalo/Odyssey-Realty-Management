import { createDeveloperController } from "@/server/controllers/realtor-developer-controller";

export async function POST(request: Request) {
  return createDeveloperController(request);
}
