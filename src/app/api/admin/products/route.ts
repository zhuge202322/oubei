import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { createProduct, listProducts } from "@/lib/server/crud";
export const runtime = "nodejs";
export async function GET(request: Request) { let db; try { db = (await requireAdmin(request)).db; return jsonOk(listProducts(db)); } catch (e) { return jsonError(e); } finally { db?.close(); } }
export async function POST(request: Request) { let db; try { assertSameOrigin(request); db = (await requireAdmin(request)).db; const id = createProduct(db, await request.json()); return jsonOk({ id, url: `/products/${(db.prepare("select slug from products where id = ?").get(id) as { slug: string }).slug}` }, { status: 201 }); } catch (e) { return jsonError(e); } finally { db?.close(); } }
