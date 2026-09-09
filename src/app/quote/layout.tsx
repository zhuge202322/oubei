import type { Metadata } from "next";
import { createPageMetadata, PUBLIC_PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(PUBLIC_PAGE_SEO.quote);

export default function QuoteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
