import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { getSiteSettings, updateSiteSettings } from "@/lib/server/crud";
export const runtime = "nodejs";
export async function GET(request: Request) { let db; try { db = (await requireAdmin(request)).db; return jsonOk(getSiteSettings(db)); } catch (e) { return jsonError(e); } finally { db?.close(); } }
export async function PATCH(request: Request) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; updateSiteSettings(db, await request.json()); return jsonOk(getSiteSettings(db)); } catch (e) { return jsonError(e); } finally { db?.close(); } }
