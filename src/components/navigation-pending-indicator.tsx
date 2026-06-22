"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationPendingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;

      if (!(target instanceof HTMLAnchorElement) || target.target === "_blank" || target.hasAttribute("download")) {
        return;
      }

      const url = new URL(target.href, window.location.href);

      if (url.origin !== window.location.origin || url.pathname + url.search === window.location.pathname + window.location.search) {
        return;
      }

      setIsPending(true);
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return isPending ? (
    <div aria-live="polite" className="navigation-pending-indicator" role="status">
      Loading
    </div>
  ) : null;
}
