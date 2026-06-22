"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  ExternalLink,
  Home,
  Mail,
  Menu,
  UserRound,
  UsersRound
} from "lucide-react";

import { RealtorLogoutButton } from "@/components/realtor-logout-button";
import { NavigationPendingIndicator } from "@/components/navigation-pending-indicator";
import { RealtorRouteToast } from "@/components/realtor-route-toast";
import { cn } from "@/lib/utils";

type RealtorShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/realtor", label: "Dashboard", key: "dashboard", icon: Home },
  { href: "/realtor/developers", label: "Developers", key: "developers", icon: UsersRound },
  { href: "/realtor/contact", label: "Profile", key: "contact", icon: Mail },
  { href: "/", label: "Public Preview", key: "preview", icon: ExternalLink }
] as const;

export function RealtorShell({ children }: RealtorShellProps) {
  const pathname = usePathname();

  if (pathname === "/realtor/login") {
    return (
      <>
        <Suspense fallback={null}>
          <NavigationPendingIndicator />
          <RealtorRouteToast />
        </Suspense>
        {children}
      </>
    );
  }

  const active = getActiveSection(pathname);

  return (
    <div className="min-h-screen bg-bone text-canopy">
      <Suspense fallback={null}>
        <NavigationPendingIndicator />
        <RealtorRouteToast />
      </Suspense>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-sprout focus:px-4 focus:py-2 focus:font-black"
        href="#realtor-content"
      >
        Skip to dashboard
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r-[3px] border-canopy bg-bone xl:block">
        <RealtorSidebar active={active} />
      </aside>

      <div className="min-w-0 xl:ml-[280px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b-[3px] border-canopy bg-bone px-4 py-3 xl:hidden">
          <Link className="font-display text-lg font-black uppercase" href="/realtor">
            Meridian CMS
          </Link>
          <details className="relative">
            <summary className="brutal-button flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs uppercase">
              <Menu aria-hidden="true" className="h-4 w-4" />
              Menu
            </summary>
            <div className="absolute right-0 mt-3 max-h-[80vh] w-[min(88vw,22rem)] overflow-auto border-[3px] border-canopy bg-bone p-3 shadow-brutal">
              <RealtorSidebar active={active} />
            </div>
          </details>
        </header>

        <main id="realtor-content">{children}</main>
      </div>
    </div>
  );
}

function RealtorSidebar({ active }: { active: string }) {
  return (
    <div className="flex h-full flex-col bg-bone">
      <Link className="sidebar-brand block bg-canopy px-8 py-8 text-bone" href="/realtor">
        <span className="block font-display text-2xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          MERIDIAN
        </span>
        <span className="block font-display text-2xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          CMS
        </span>
      </Link>

      <div className="sidebar-kicker border-b-[3px] border-canopy bg-white px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sprout">
        Realtor Portal
      </div>

      <nav aria-label="Realtor navigation" className="custom-scrollbar flex-grow overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <Link
              className={cn(
                "sidebar-nav-link flex items-center gap-4 bg-bone px-6 py-3 text-left text-[11px] font-black uppercase tracking-[0.1em] text-canopy",
                isActive && "bg-sprout"
              )}
              data-active={isActive}
              href={item.href}
              key={item.key}
              prefetch
              target={item.key === "preview" ? "_blank" : undefined}
            >
              <Icon aria-hidden="true" className="h-4 w-4 xl:hidden" />
              {item.label}
            </Link>
          );
        })}

        <div className="mx-6 my-6 h-[2px] bg-canopy opacity-40" />

        <section className="px-8">
          <span className="block text-[10px] font-black uppercase tracking-widest text-sprout">
            Logged in realtor
          </span>
          <div className="mt-3 border-2 border-canopy bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-canopy bg-sprout">
                <UserRound aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase leading-tight">Diana Reyes</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-grove">
                  Pro catalog
                </p>
              </div>
            </div>
          </div>
        </section>
      </nav>

      <footer className="border-t-[3px] border-canopy bg-white p-6">
        <RealtorLogoutButton />
      </footer>
    </div>
  );
}

function getActiveSection(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[1];

  if (segment === "developers") {
    return "developers";
  }

  if (segment === "projects") {
    return "developers";
  }

  if (segment === "contact") {
    return "contact";
  }

  return "dashboard";
}
