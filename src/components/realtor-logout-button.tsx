"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function RealtorLogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/realtor/auth/logout", {
        method: "POST"
      });
    } finally {
      router.push("/realtor/login");
      router.refresh();
    }
  }

  return (
    <button className="sidebar-agent-link w-full" disabled={isSigningOut} onClick={handleSignOut} type="button">
      <LogOut aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {isSigningOut ? "Signing out" : "Sign out"}
    </button>
  );
}
