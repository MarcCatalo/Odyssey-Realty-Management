const CHANNEL_NAME = "odyssey-catalog-updates";
const STORAGE_KEY = "odyssey-catalog-updated-at";

type CatalogUpdateHandler = () => void;

export function publishCatalogUpdate() {
  if (typeof window === "undefined") {
    return;
  }

  const timestamp = String(Date.now());

  window.localStorage.setItem(STORAGE_KEY, timestamp);

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: "catalog-updated", timestamp });
    channel.close();
  }
}

export function subscribeToCatalogUpdates(handler: CatalogUpdateHandler) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const channel =
    "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  function handleMessage(event: MessageEvent) {
    if (event.data?.type === "catalog-updated") {
      handler();
    }
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      handler();
    }
  }

  channel?.addEventListener("message", handleMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleMessage);
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
}
