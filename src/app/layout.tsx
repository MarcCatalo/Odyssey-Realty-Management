import type { Metadata } from "next";

import { CatalogShell } from "@/components/catalog-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian Realty Catalog",
  description: "A curated catalog of developer-backed real estate projects."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CatalogShell>{children}</CatalogShell>
      </body>
    </html>
  );
}
