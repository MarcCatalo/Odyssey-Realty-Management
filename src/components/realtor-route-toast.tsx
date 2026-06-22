"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const toastMessages: Record<string, string> = {
  deleted: "Developer profile deleted.",
  projectDeleted: "Project deleted.",
  saved: "Changes have been saved."
};

export function RealtorRouteToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const key = Object.keys(toastMessages).find((name) => searchParams.has(name));

    if (!key) {
      return;
    }

    setMessage(toastMessages[key]);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(key);
    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams}` : pathname;

    const cleanupId = window.setTimeout(() => {
      router.replace(nextUrl, { scroll: false });
    }, 500);
    const hideId = window.setTimeout(() => setMessage(null), 4200);

    return () => {
      window.clearTimeout(cleanupId);
      window.clearTimeout(hideId);
    };
  }, [pathname, router, searchParams]);

  return message ? (
    <div aria-live="polite" className="realtor-feedback-toast">
      <span>{message}</span>
    </div>
  ) : null;
}
