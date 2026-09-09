import type { Metadata } from "next";
import { createPageMetadata, PUBLIC_PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(PUBLIC_PAGE_SEO.products);

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
