import { updateRealtorProfileController } from "@/server/controllers/realtor-profile-controller";

export async function PATCH(request: Request) {
  return updateRealtorProfileController(request);
}
