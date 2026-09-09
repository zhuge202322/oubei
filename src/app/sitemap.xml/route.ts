import { buildSitemapXml, SITEMAP_PAGES } from "@/lib/sitemap";
import { getResolvedSiteContent } from "@/lib/server/content";
import { openDatabase } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = openDatabase();
  try {
    const content = await getResolvedSiteContent(db);
    const xml = buildSitemapXml(SITEMAP_PAGES, content.products);
    return new Response(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=300",
      },
    });
  } finally {
    db.close();
  }
}

