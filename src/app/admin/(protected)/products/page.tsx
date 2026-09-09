"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  ImageIcon,
  LoaderCircle,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminField, AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminForm";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminTable";

type ProductImage = {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  code: string;
  categoryId: number | null;
  categoryName: string | null;
  shortDescription: string;
  description: string;
  material: string;
  applications: string[];
  specs: string[];
  imageDefaultPath: string | null;
  isActive: boolean;
  gallery: ProductImage[];
};

type Category = {
  id: number;
  name: string;
};

type FormState = {
  name: string;
  slug: string;
  code: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  material: string;
  applications: string;
  specs: string;
  imageDefaultPath: string;
  isActive: boolean;
};

type Notice = { tone: "success" | "error"; text: string } | null;

const emptyForm: FormState = {
  name: "",
  slug: "",
  code: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  material: "",
  applications: "",
  specs: "",
  imageDefaultPath: "",
  isActive: true,
};

function formFromProduct(product: Product): FormState {
  return {
    name: product.name,
    slug: product.slug,
    code: product.code,
    categoryId: product.categoryId ? String(product.categoryId) : "",
    shortDescription: product.shortDescription,
    description: product.description,
    material: product.material,
    applications: product.applications.join("\n"),
    specs: product.specs.join("\n"),
    imageDefaultPath: product.imageDefaultPath || "",
    isActive: product.isActive,
  };
}

async function readResponse<T>(response: Response): Promise<{ data: T | null; error: string | null }> {
  return response.json();
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editingProduct = products.find((product) => product.id === editingId) || null;

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !needle || [product.name, product.code, product.slug, product.categoryName || ""]
        .some((value) => value.toLowerCase().includes(needle));
      const matchesCategory = !categoryFilter || String(product.categoryId || "") === categoryFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? product.isActive : !product.isActive);
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, products, query, statusFilter]);

  async function loadProducts() {
    const response = await fetch("/api/admin/products");
    const payload = await readResponse<Product[]>(response);
    if (!response.ok || !payload.data) throw new Error(payload.error || "Unable to load products");
    setProducts(payload.data);
    return payload.data;
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);
        const [productPayload, categoryPayload] = await Promise.all([
          readResponse<Product[]>(productResponse),
          readResponse<Category[]>(categoryResponse),
        ]);
        if (!productResponse.ok || !productPayload.data) throw new Error(productPayload.error || "Unable to load products");
        if (!categoryResponse.ok || !categoryPayload.data) throw new Error(categoryPayload.error || "Unable to load categories");
        if (!cancelled) {
          setProducts(productPayload.data);
          setCategories(categoryPayload.data);
        }
      } catch (error) {
        if (!cancelled) setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to load products" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  function startAdding() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
    setEditorOpen(true);
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setForm(formFromProduct(product));
    setNotice(null);
    setEditorOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeEditor() {
    setEditingId(null);
    setForm(emptyForm);
    setEditorOpen(false);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        applications: form.applications.split("\n").map((item) => item.trim()).filter(Boolean),
        specs: form.specs.split("\n").map((item) => item.trim()).filter(Boolean),
        imageDefaultPath: form.imageDefaultPath || null,
      };
      const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readResponse<{ id: number }>(response);
      if (!response.ok || !result.data) throw new Error(result.error || "Unable to save product");
      const nextProducts = await loadProducts();
      const savedProduct = nextProducts.find((product) => product.id === result.data?.id);
      if (savedProduct) {
        setEditingId(savedProduct.id);
        setForm(formFromProduct(savedProduct));
      }
      setNotice({ tone: "success", text: editingId ? "Product updated" : "Product created" });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save product" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const result = await readResponse<{ id: number }>(response);
      if (!response.ok) throw new Error(result.error || "Unable to delete product");
      if (editingId === product.id) closeEditor();
      await loadProducts();
      setNotice({ tone: "success", text: "Product deleted" });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to delete product" });
    }
  }

  async function uploadImages(files: File[]) {
    if (!editingId || files.length === 0) return;
    setUploading(true);
    setNotice(null);
    try {
      for (const file of files) {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch(`/api/admin/products/${editingId}/images`, { method: "POST", body });
        const result = await readResponse<{ id: number }>(response);
        if (!response.ok) throw new Error(result.error || `Unable to upload ${file.name}`);
      }
      await loadProducts();
      setNotice({ tone: "success", text: files.length === 1 ? "Image uploaded" : `${files.length} images uploaded` });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to upload image" });
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(imageId: number) {
    if (!editingId || !window.confirm("Delete this product image?")) return;
    const response = await fetch(`/api/admin/products/${editingId}/images?imageId=${imageId}`, { method: "DELETE" });
    const result = await readResponse<{ imageId: number }>(response);
    if (!response.ok) {
      setNotice({ tone: "error", text: result.error || "Unable to delete image" });
      return;
    }
    await loadProducts();
    setNotice({ tone: "success", text: "Image deleted" });
  }

  async function moveImage(imageId: number, direction: -1 | 1) {
    if (!editingId || !editingProduct) return;
    const index = editingProduct.gallery.findIndex((image) => image.id === imageId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= editingProduct.gallery.length) return;
    const order = editingProduct.gallery.map((image) => image.id);
    [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
    const response = await fetch(`/api/admin/products/${editingId}/images`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order }),
    });
    const result = await readResponse<{ order: number[] }>(response);
    if (!response.ok) {
      setNotice({ tone: "error", text: result.error || "Unable to reorder images" });
      return;
    }
    await loadProducts();
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} catalog products`}
        action={(
          <button type="button" onClick={startAdding} className="inline-flex h-10 items-center gap-2 bg-[#0b2545] px-4 text-sm font-semibold text-white hover:bg-[#163d68]">
            <Plus className="h-4 w-4" /> Add product
          </button>
        )}
      />

      {notice ? (
        <div role="status" className={`mb-5 flex items-center gap-2 border px-4 py-3 text-sm ${notice.tone === "success" ? "border-[#b8d8c2] bg-[#f1faf4] text-[#176035]" : "border-[#e4b8b8] bg-[#fff5f5] text-[#a11f1f]"}`}>
          {notice.tone === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
          <span>{notice.text}</span>
          <button type="button" title="Dismiss" aria-label="Dismiss notification" onClick={() => setNotice(null)} className="ml-auto p-1"><X className="h-4 w-4" /></button>
        </div>
      ) : null}

      <div className={`grid gap-6 ${editorOpen ? "xl:grid-cols-[440px_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {editorOpen ? (
          <AdminPanel className="self-start p-5 xl:sticky xl:top-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-[#718096]">{editingId ? `Product #${editingId}` : "New product"}</p>
                <h2 className="mt-1 text-lg font-semibold text-[#0b2545]">{editingId ? "Edit product" : "Add product"}</h2>
              </div>
              <button type="button" title="Close editor" aria-label="Close product editor" onClick={closeEditor} className="p-2 text-[#64748b] hover:bg-[#edf2f7] hover:text-[#0b2545]"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={saveProduct} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <AdminField label="Product name"><AdminInput required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></AdminField>
                <AdminField label="Product code"><AdminInput required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></AdminField>
              </div>
              <AdminField label="URL slug"><AdminInput value={form.slug} placeholder="Generated from product name" onChange={(event) => setForm({ ...form, slug: event.target.value })} /></AdminField>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <AdminField label="Category"><AdminSelect value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</AdminSelect></AdminField>
                <AdminField label="Material"><AdminInput value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} /></AdminField>
              </div>
              <AdminField label="Short description"><AdminTextarea className="min-h-20" value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} /></AdminField>
              <AdminField label="Full description"><AdminTextarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></AdminField>
              <AdminField label="Applications"><AdminTextarea placeholder="One item per line" value={form.applications} onChange={(event) => setForm({ ...form, applications: event.target.value })} /></AdminField>
              <AdminField label="Specifications"><AdminTextarea placeholder="One item per line" value={form.specs} onChange={(event) => setForm({ ...form, specs: event.target.value })} /></AdminField>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 border border-[#c7d2e1] px-3 text-sm font-medium text-[#20324a]">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-[#0b2545]" />
                Published on website
              </label>

              <div className="flex items-center gap-3 border-t border-[#e1e7ef] pt-5">
                <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 bg-[#0b2545] px-4 text-sm font-semibold text-white hover:bg-[#163d68] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {editingId ? "Save changes" : "Create product"}
                </button>
                <button type="button" onClick={closeEditor} className="h-10 px-3 text-sm font-medium text-[#526176] hover:text-[#0b2545]">Cancel</button>
              </div>
            </form>

            {editingProduct ? (
              <section className="mt-7 border-t border-[#d4dde8] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0b2545]">Product images</h3>
                    <p className="mt-1 text-xs text-[#64748b]">{editingProduct.gallery.length} uploaded</p>
                  </div>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 border border-[#0b2545] px-3 text-xs font-semibold text-[#0b2545] hover:bg-[#edf2f7]">
                    {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="sr-only" disabled={uploading} onChange={(event) => { const files = Array.from(event.currentTarget.files || []); event.currentTarget.value = ""; void uploadImages(files); }} />
                  </label>
                </div>

                {editingProduct.gallery.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {editingProduct.gallery.map((image, index) => (
                      <div key={image.id} className="border border-[#d4dde8] bg-[#f8fafc] p-2">
                        <div className="relative aspect-square overflow-hidden bg-white">
                          <Image src={image.url} alt={image.alt || editingProduct.name} fill sizes="200px" className="object-contain" />
                          {index === 0 ? <span className="absolute left-2 top-2 bg-[#0b2545] px-2 py-1 text-[10px] font-semibold uppercase text-white">Main</span> : null}
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <button type="button" disabled={index === 0} title="Move image earlier" aria-label="Move image earlier" onClick={() => void moveImage(image.id, -1)} className="p-2 text-[#526176] hover:bg-white hover:text-[#0b2545] disabled:opacity-25"><ArrowUp className="h-4 w-4" /></button>
                          <button type="button" disabled={index === editingProduct.gallery.length - 1} title="Move image later" aria-label="Move image later" onClick={() => void moveImage(image.id, 1)} className="p-2 text-[#526176] hover:bg-white hover:text-[#0b2545] disabled:opacity-25"><ArrowDown className="h-4 w-4" /></button>
                          <button type="button" title="Delete image" aria-label="Delete image" onClick={() => void removeImage(image.id)} className="p-2 text-[#b42318] hover:bg-white"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex min-h-28 items-center justify-center border border-dashed border-[#c7d2e1] bg-[#f8fafc] text-[#8491a3]"><ImageIcon className="h-6 w-6" aria-hidden="true" /></div>
                )}
              </section>
            ) : null}
          </AdminPanel>
        ) : null}

        <div className="min-w-0">
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(220px,1fr)_190px_150px]">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8798]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, code or slug" className="h-11 w-full border border-[#c7d2e1] bg-white pl-10 pr-3 text-sm text-[#1c2b3f] outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/15" />
            </label>
            <AdminSelect aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="mt-0"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</AdminSelect>
            <AdminSelect aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-0"><option value="all">All statuses</option><option value="active">Published</option><option value="hidden">Hidden</option></AdminSelect>
          </div>

          <AdminPanel className="overflow-hidden">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center text-[#64748b]"><LoaderCircle className="h-6 w-6 animate-spin" aria-label="Loading products" /></div>
            ) : filteredProducts.length ? (
              <>
                <div className="divide-y divide-[#edf1f5] md:hidden">
                  {filteredProducts.map((product) => {
                    const imageUrl = product.gallery[0]?.url || product.imageDefaultPath;
                    return (
                      <article key={product.id} className={`p-4 ${editingId === product.id ? "bg-[#f1f6fb]" : "bg-white"}`}>
                        <div className="flex min-w-0 gap-3">
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-[#dce3eb] bg-white">{imageUrl ? <Image src={imageUrl} alt="" fill sizes="56px" className="object-contain" /> : <ImageIcon className="h-5 w-5 text-[#a0abba]" />}</div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-[#20324a]">{product.name}</p>
                            <p className="mt-1 truncate font-mono text-xs text-[#6b7788]">{product.code} · /{product.slug}</p>
                            <div className="mt-2 flex items-center justify-between gap-3">
                              <span className="truncate text-xs text-[#526176]">{product.categoryName || "Uncategorized"}</span>
                              <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${product.isActive ? "text-[#176035]" : "text-[#7b8798]"}`}><span className={`h-2 w-2 ${product.isActive ? "bg-[#36a269]" : "bg-[#a8b1bd]"}`} />{product.isActive ? "Published" : "Hidden"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end gap-2 border-t border-[#edf1f5] pt-2">
                          <Link href={`/products/${product.slug}`} target="_blank" title="View product" aria-label={`View ${product.name}`} className="p-2 text-[#526176] hover:bg-[#edf2f7] hover:text-[#0b2545]"><Eye className="h-4 w-4" /></Link>
                          <button type="button" title="Edit product" aria-label={`Edit ${product.name}`} onClick={() => startEditing(product)} className="p-2 text-[#526176] hover:bg-[#edf2f7] hover:text-[#0b2545]"><Pencil className="h-4 w-4" /></button>
                          <button type="button" title="Delete product" aria-label={`Delete ${product.name}`} onClick={() => void deleteProduct(product)} className="p-2 text-[#b42318] hover:bg-[#fff1f0]"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] table-fixed text-left text-sm">
                  <thead className="border-b border-[#d4dde8] bg-[#f8fafc] text-xs uppercase text-[#64748b]"><tr><th className="w-20 px-4 py-3">Image</th><th className="px-3 py-3">Product</th><th className="w-36 px-3 py-3">Category</th><th className="w-24 px-3 py-3">Status</th><th className="w-36 px-4 py-3 text-right">Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const imageUrl = product.gallery[0]?.url || product.imageDefaultPath;
                      return (
                        <tr key={product.id} className={`border-b border-[#edf1f5] last:border-0 ${editingId === product.id ? "bg-[#f1f6fb]" : "hover:bg-[#fafbfd]"}`}>
                          <td className="px-4 py-3"><div className="relative flex h-12 w-12 items-center justify-center overflow-hidden border border-[#dce3eb] bg-white">{imageUrl ? <Image src={imageUrl} alt="" fill sizes="48px" className="object-contain" /> : <ImageIcon className="h-5 w-5 text-[#a0abba]" />}</div></td>
                          <td className="px-3 py-3"><p className="truncate font-semibold text-[#20324a]">{product.name}</p><p className="mt-1 truncate font-mono text-xs text-[#6b7788]">{product.code} · /{product.slug}</p></td>
                          <td className="truncate px-3 py-3 text-[#526176]">{product.categoryName || "Uncategorized"}</td>
                          <td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${product.isActive ? "text-[#176035]" : "text-[#7b8798]"}`}><span className={`h-2 w-2 ${product.isActive ? "bg-[#36a269]" : "bg-[#a8b1bd]"}`} />{product.isActive ? "Published" : "Hidden"}</span></td>
                          <td className="px-4 py-3"><div className="flex justify-end gap-1"><Link href={`/products/${product.slug}`} target="_blank" title="View product" aria-label={`View ${product.name}`} className="p-2 text-[#526176] hover:bg-[#edf2f7] hover:text-[#0b2545]"><Eye className="h-4 w-4" /></Link><button type="button" title="Edit product" aria-label={`Edit ${product.name}`} onClick={() => startEditing(product)} className="p-2 text-[#526176] hover:bg-[#edf2f7] hover:text-[#0b2545]"><Pencil className="h-4 w-4" /></button><button type="button" title="Delete product" aria-label={`Delete ${product.name}`} onClick={() => void deleteProduct(product)} className="p-2 text-[#b42318] hover:bg-[#fff1f0]"><Trash2 className="h-4 w-4" /></button></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><PackageOpen className="h-8 w-8 text-[#8a97a8]" /><p className="mt-3 text-sm font-semibold text-[#33445a]">No products found</p><p className="mt-1 text-xs text-[#718096]">Change the filters or add a product.</p></div>
            )}
          </AdminPanel>
          <p className="mt-3 text-xs text-[#718096]">Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </div>
    </>
  );
}
