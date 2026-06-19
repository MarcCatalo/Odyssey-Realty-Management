export function sanitizeLoginEmail(value: string) {
  return sanitizeCredential(value).toLowerCase();
}

export function sanitizeLoginPassword(value: string) {
  return sanitizeCredential(value);
}

function sanitizeCredential(value: string) {
  return value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}
