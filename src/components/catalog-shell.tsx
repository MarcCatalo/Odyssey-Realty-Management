"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  GalleryHorizontal,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  UsersRound
} from "lucide-react";
import { useEffect } from "react";

import { developers, salesAgent } from "@/features/catalog/data";
import {
  getDeveloperBySlug,
  getDeveloperRoute,
  getProjectsForDeveloper
} from "@/features/catalog/queries";
import { cn } from "@/lib/utils";

type CatalogShellProps = {
  children: React.ReactNode;
  active?: "home" | "developers" | "gallery" | "contact";
  activeDeveloperSlug?: string;
  activeProjectSlug?: string;
};

const navItems = [
  { href: "/", label: "Homepage", key: "home", icon: Home },
  { href: "/developers", label: "Developers", key: "developers", icon: UsersRound },
  { href: "/gallery", label: "Gallery", key: "gallery", icon: GalleryHorizontal },
  { href: "/contact", label: "Contact", key: "contact", icon: Mail }
] as const;

export function CatalogShell({
  children,
  active,
  activeDeveloperSlug,
  activeProjectSlug
}: CatalogShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const routeState = getRouteState(pathname);
  const resolvedActive = active ?? routeState.active;
  const resolvedDeveloperSlug = activeDeveloperSlug ?? routeState.activeDeveloperSlug;
  const resolvedProjectSlug = activeProjectSlug ?? routeState.activeProjectSlug;

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/realtor")) {
      return;
    }

    getPrefetchRoutes().forEach((route) => {
      router.prefetch(route);
    });
  }, [pathname, router]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/realtor")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bone text-canopy">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-sprout focus:px-4 focus:py-2 focus:font-black"
        href="#content"
      >
        Skip to content
      </a>

      <div className="min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r-[3px] border-canopy bg-bone xl:block">
          <SidebarContent
            active={resolvedActive}
            activeDeveloperSlug={resolvedDeveloperSlug}
            activeProjectSlug={resolvedProjectSlug}
          />
        </aside>

        <div className="min-w-0 xl:ml-[280px]">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b-[3px] border-canopy bg-bone px-4 py-3 xl:hidden">
            <Link className="font-display text-lg font-black" href="/">
              MERIDIAN
            </Link>
            <details className="relative">
              <summary className="brutal-button flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs">
                <Menu aria-hidden="true" className="h-4 w-4" />
                Menu
              </summary>
              <div className="absolute right-0 mt-3 max-h-[80vh] w-[min(88vw,22rem)] overflow-auto border-[3px] border-canopy bg-bone p-3 shadow-brutal">
                <SidebarContent
                  active={resolvedActive}
                  activeDeveloperSlug={resolvedDeveloperSlug}
                  activeProjectSlug={resolvedProjectSlug}
                />
              </div>
            </details>
          </header>

          <main id="content">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  active,
  activeDeveloperSlug,
  activeProjectSlug
}: Pick<CatalogShellProps, "active" | "activeDeveloperSlug" | "activeProjectSlug">) {
  const activeDeveloper = activeDeveloperSlug ? getDeveloperBySlug(activeDeveloperSlug) : undefined;

  return (
    <div className="flex h-full flex-col bg-bone">
      <Link className="sidebar-brand block bg-canopy px-8 py-8 text-bone" href="/">
        <span className="block font-display text-2xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          MERIDIAN
        </span>
        <span className="block font-display text-2xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
          GROUP
        </span>
      </Link>
      <div className="sidebar-kicker border-b-[3px] border-canopy bg-white px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sprout">
        DEVELOPER CATALOG
      </div>

      <nav
        aria-label="Primary navigation"
        className="custom-scrollbar flex-grow overflow-y-auto py-4"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <div key={item.key}>
              <Link
                className={cn(
                  "sidebar-nav-link flex items-center gap-4 bg-bone px-6 py-3 text-left text-[11px] font-black uppercase tracking-[0.1em] text-canopy",
                  isActive && "bg-sprout"
                )}
                data-active={isActive}
                href={item.href}
                prefetch
              >
                <Icon aria-hidden="true" className="h-4 w-4 xl:hidden" />
                {item.label}
              </Link>

              {item.key === "developers" ? (
                <div
                  className={cn(
                    "sidebar-subtree bg-bone",
                    active === "developers" ? "sidebar-subtree-open" : "sidebar-subtree-closed"
                  )}
                  style={getDisclosureStyle(active === "developers", "36rem", "-10px")}
                >
                  <div className="sidebar-subtree-inner flex flex-col">
                    {developers.map((developer) => {
                      const developerActive = developer.slug === activeDeveloperSlug;

                      return (
                        <div key={developer.id}>
                          <Link
                            className={cn(
                              "sidebar-developer-link ml-[34px] block border-l-2 border-sprout bg-bone py-2 pl-7 pr-6 text-[10px] font-bold uppercase tracking-[0.04em] text-canopy",
                              developerActive && "text-grove"
                            )}
                            data-active={developerActive}
                            href={getDeveloperRoute(developer.slug)}
                            prefetch
                          >
                            {developer.name}
                          </Link>
                          <div
                            className={cn(
                              "sidebar-project-subtree bg-bone",
                              developerActive
                                ? "sidebar-project-subtree-open"
                                : "sidebar-project-subtree-closed"
                            )}
                            style={getDisclosureStyle(developerActive, "16rem", "-10px")}
                          >
                            <div className="sidebar-subtree-inner flex flex-col">
                              {getProjectsForDeveloper(developer.slug).map((project) => (
                                <ProjectChildLink
                                  active={activeProjectSlug === project.slug}
                                  href={`/developers/${developer.slug}/projects/${project.slug}`}
                                  key={project.id}
                                  label={project.title}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        <div
          className={cn(
            "sidebar-selection-shell",
            activeDeveloper ? "sidebar-selection-open" : "sidebar-selection-closed"
          )}
          style={getDisclosureStyle(Boolean(activeDeveloper), "14rem", "10px")}
        >
          <div className="sidebar-subtree-inner">
            {activeDeveloper ? (
              <>
                <SidebarDivider />
                <section className="sidebar-selection px-8">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-sprout">
                    Current selection
                  </span>
                  <h2 className="mt-2 text-[12px] font-black uppercase leading-tight">
                    {activeDeveloper.name}
                  </h2>
                  <p className="mt-1 text-[10px] font-bold leading-snug text-canopy">
                    {activeDeveloper.specialty}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      className="sidebar-mini-button"
                      href={getDeveloperRoute(activeDeveloper.slug)}
                      prefetch
                    >
                      View profile
                    </Link>
                    <Link className="sidebar-mini-button" href="/contact" prefetch>
                      Contact
                    </Link>
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </div>

        <SidebarDivider />

        <section className="px-8">
          <span className="block text-[10px] font-black uppercase tracking-widest text-sprout">
            Agent contact
          </span>
          <div className="mt-3 space-y-2">
            {salesAgent.contactLinks
              .filter((link) => link.isEnabled)
              .slice(0, 3)
              .map((link) => {
                const Icon =
                  link.type === "phone"
                    ? Phone
                    : link.type === "email"
                      ? Mail
                      : link.type === "facebook" || link.type === "messenger"
                        ? MessageCircle
                        : ExternalLink;

                return (
                  <a
                    className="sidebar-agent-link"
                    href={link.href}
                    key={link.id}
                    rel="noreferrer"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span>{link.value}</span>
                  </a>
                );
              })}
          </div>
        </section>
      </nav>

      <footer className="border-t-[3px] border-canopy bg-white p-6">
        <p className="text-[9px] font-bold uppercase leading-relaxed tracking-wider text-canopy">
          This catalog is curated by Meridian Group agents. Not a marketplace.
        </p>
      </footer>
    </div>
  );
}

function SidebarDivider() {
  return <div className="mx-6 my-6 h-[2px] bg-canopy opacity-40" />;
}

function ProjectChildLink({
  active,
  href,
  label
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      className={cn(
        "sidebar-child-link ml-[52px] block border-l-2 border-sprout bg-bone py-1.5 pl-5 pr-6 text-[9px] font-bold uppercase tracking-[0.04em] text-canopy",
        active && "text-grove"
      )}
      data-active={active}
      href={href}
      prefetch
    >
      {label}
    </Link>
  );
}

function getRouteState(pathname: string): Required<Pick<CatalogShellProps, "active">> &
  Pick<CatalogShellProps, "activeDeveloperSlug" | "activeProjectSlug"> {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "developers") {
    return {
      active: "developers",
      activeDeveloperSlug: segments[1],
      activeProjectSlug: segments[2] === "projects" ? segments[3] : undefined
    };
  }

  if (segments[0] === "gallery") {
    return { active: "gallery" };
  }

  if (segments[0] === "contact") {
    return { active: "contact" };
  }

  return { active: "home" };
}

function getPrefetchRoutes() {
  return [
    "/",
    "/developers",
    "/gallery",
    "/contact",
    ...developers.flatMap((developer) => [
      getDeveloperRoute(developer.slug),
      ...getProjectsForDeveloper(developer.slug).map(
        (project) => `/developers/${developer.slug}/projects/${project.slug}`
      )
    ])
  ];
}

function getDisclosureStyle(isOpen: boolean, openMaxHeight: string, closedOffset: string) {
  return {
    gridTemplateRows: isOpen ? "1fr" : "0fr",
    maxHeight: isOpen ? openMaxHeight : "0",
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : `translateY(${closedOffset})`
  };
}
