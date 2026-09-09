import type { Metadata } from "next";
import { createPageMetadata, PUBLIC_PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(PUBLIC_PAGE_SEO.fkm);

export default function FkmProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
