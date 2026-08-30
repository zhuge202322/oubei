import { getResolvedSiteContent } from "@/lib/server/content";
import { openDatabase } from "@/lib/server/db";
export const runtime = "nodejs";
export async function GET() { const db=openDatabase(); const content=await getResolvedSiteContent(db); db.close(); return Response.json({data:{settings:content.settings,mediaSlots:content.mediaSlots},error:null},{headers:{"cache-control":"no-store"}}); }
