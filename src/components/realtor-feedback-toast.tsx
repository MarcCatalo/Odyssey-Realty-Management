"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function RealtorFeedbackToast({ message }: { message: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div aria-live="polite" className="realtor-feedback-toast">
      <span>{message}</span>
    </div>,
    document.body
  );
}
