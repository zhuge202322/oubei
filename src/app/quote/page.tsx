import QuotePageClient from "./quote-client";
import { getResolvedSiteContent } from "@/lib/server/content";
import { openDatabase } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export default async function QuotePage() {
  const db = openDatabase();
  try {
    const content = await getResolvedSiteContent(db);
    return <QuotePageClient contact={content.settings.contact} />;
  } finally {
    db.close();
  }
}
