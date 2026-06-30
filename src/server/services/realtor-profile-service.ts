import { updateRealtorProfile } from "@/server/repositories/realtor-profile-repository";
import type { UpdateRealtorProfileInput } from "@/server/validators/realtor-profile";

export function updateProfileForRealtor({
  input,
  realtorId
}: {
  input: UpdateRealtorProfileInput;
  realtorId: string;
}) {
  return updateRealtorProfile({ input, realtorId });
}
