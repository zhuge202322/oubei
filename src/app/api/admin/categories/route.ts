import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { createCategory, listCategories } from "@/lib/server/crud";
export const runtime = "nodejs";
export async function GET(request: Request) { let db; try { db = (await requireAdmin(request)).db; return jsonOk(listCategories(db)); } catch (e) { return jsonError(e); } finally { db?.close(); } }
export async function POST(request: Request) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = createCategory(db, await request.json()); return jsonOk({ id }, { status: 201 }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
