import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { deleteCategory, updateCategory } from "@/lib/server/crud";
export const runtime = "nodejs";
const getId = async (context: { params: Promise<{ id: string }> }) => Number((await context.params).id);
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = await getId(context); if (!Number.isInteger(id)) return Response.json({ data: null, error: "Invalid id" }, { status: 400 }); updateCategory(db, id, await request.json()); return jsonOk({ id }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = await getId(context); if (!Number.isInteger(id)) return Response.json({ data: null, error: "Invalid id" }, { status: 400 }); deleteCategory(db, id); return jsonOk({ id }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
