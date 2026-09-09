import type { Metadata } from "next";
import { TechnicalWhitepaperPage } from "../technical-whitepapers/high-temperature-o-ring-material/page";
import { createPageMetadata, PUBLIC_PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(PUBLIC_PAGE_SEO.hardness);

export default function ChoosingORingHardnessPage() {
  return <TechnicalWhitepaperPage variant="hardness" />;
}
