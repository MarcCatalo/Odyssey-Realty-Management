export const publicCatalogTag = "public-catalog";

export function realtorCatalogTag(realtorId: string) {
  return `realtor-catalog:${realtorId}`;
}

export function realtorSubscriptionTag(realtorId: string) {
  return `realtor-subscription:${realtorId}`;
}
