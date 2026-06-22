import { RealtorContactProfileEditor } from "@/components/realtor-contact-profile-editor";
import { getCatalogForRealtorId } from "@/features/catalog/live-queries";
import { requireRealtorContextForPage } from "@/server/auth/realtor-session";

export const dynamic = "force-dynamic";

export default async function RealtorContactProfilePage() {
  const context = await requireRealtorContextForPage();
  const catalog = await getCatalogForRealtorId(context.realtorId);

  return <RealtorContactProfileEditor salesAgent={catalog.salesAgent} />;
}
