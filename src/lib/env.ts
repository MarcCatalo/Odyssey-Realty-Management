export function getConfiguredEnvValue(value: string | undefined) {
  if (!value || value.startsWith("paste_")) {
    return null;
  }

  return value;
}
