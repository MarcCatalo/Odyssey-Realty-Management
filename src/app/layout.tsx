import type { Metadata } from "next";

import { CatalogShell } from "@/components/catalog-shell";
import { getPublicCatalog } from "@/features/catalog/live-queries";

import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian Realty Catalog",
  description: "A curated catalog of developer-backed real estate projects."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalog = await getPublicCatalog();

  return (
    <html lang="en">
      <body>
        <CatalogShell
          developers={catalog.developers.filter((developer) => developer.status === "published")}
          projects={catalog.projects.filter((project) => project.publicationStatus === "published")}
          salesAgent={catalog.salesAgent}
        >
          {children}
        </CatalogShell>
      </body>
    </html>
  );
}
