const SLUG_MAX_LENGTH = 80;

export function createSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, "");

  return slug || "item";
}

export function createUniqueSlug(baseValue: string, existingSlugs: string[]) {
  const baseSlug = createSlug(baseValue);
  const existing = new Set(existingSlugs);

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const nextSlug = `${baseSlug}-${suffix}`;

    if (!existing.has(nextSlug)) {
      return nextSlug;
    }
  }

  throw new Error("Could not create a unique slug.");
}
