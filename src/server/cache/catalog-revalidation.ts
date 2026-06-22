import { revalidatePath, revalidateTag } from "next/cache";

import { publicCatalogTag, realtorCatalogTag } from "@/server/cache/catalog-cache-tags";

const publicCatalogPaths = ["/", "/developers", "/gallery", "/contact"];
const realtorCatalogPaths = ["/realtor", "/realtor/developers", "/realtor/contact"];

export function revalidateCatalogPaths(paths: string[] = [], realtorId?: string) {
  revalidateTag(publicCatalogTag);

  if (realtorId) {
    revalidateTag(realtorCatalogTag(realtorId));
  }

  const uniquePaths = new Set([...publicCatalogPaths, ...realtorCatalogPaths, ...paths]);

  uniquePaths.forEach((path) => {
    revalidatePath(path);
  });
}
