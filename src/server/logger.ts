type LogLevel = "error" | "info" | "warn";

type LogFields = Record<string, boolean | number | string | null | undefined>;

function writeLog(level: LogLevel, event: string, fields: LogFields = {}) {
  const cleanFields = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  );
  const payload = {
    event,
    ...cleanFields
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export function logInfo(event: string, fields?: LogFields) {
  writeLog("info", event, fields);
}

export function logWarn(event: string, fields?: LogFields) {
  writeLog("warn", event, fields);
}
