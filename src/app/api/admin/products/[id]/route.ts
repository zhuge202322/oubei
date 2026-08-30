import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { deleteProduct, updateProduct } from "@/lib/server/crud";
import { deleteUnreferencedMedia } from "@/lib/server/media";
import { getRuntimeConfig } from "@/lib/server/config";
export const runtime = "nodejs";
const getId = async (context: { params: Promise<{ id: string }> }) => Number((await context.params).id);
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = await getId(context); if (!Number.isInteger(id)) return Response.json({ data: null, error: "Invalid id" }, { status: 400 }); updateProduct(db, id, await request.json()); const slug = (db.prepare("select slug from products where id = ?").get(id) as { slug: string }).slug; return jsonOk({ id, url: `/products/${slug}` }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = await getId(context); if (!Number.isInteger(id)) return Response.json({ data: null, error: "Invalid id" }, { status: 400 }); deleteProduct(db, id); await deleteUnreferencedMedia(db, getRuntimeConfig().dataDir); return jsonOk({ id }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
