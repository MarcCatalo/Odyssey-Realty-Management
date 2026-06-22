"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { subscribeToCatalogUpdates } from "@/lib/catalog-update-signal";

export function PublicCatalogAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }

    const unsubscribe = subscribeToCatalogUpdates(refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [router]);

  return null;
}
