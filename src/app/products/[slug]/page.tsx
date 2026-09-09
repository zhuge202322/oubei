import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, Footer, Header } from "@/components/site";
import { getResolvedProductBySlug } from "@/lib/server/content";
import { openDatabase } from "@/lib/server/db";
import { createProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = openDatabase();
  try {
    const product = await getResolvedProductBySlug(db, slug);
    return product ? createProductMetadata(product) : {};
  } finally {
    db.close();
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = openDatabase();
  const product = await getResolvedProductBySlug(db, slug);
  db.close();
  if (!product) notFound();
  return <><Header activePath="/products"/><main className="bg-background"><Container className="py-10 sm:py-14"><Breadcrumbs items={[{label:"Products",href:"/products"},{label:product.name}]} className="mb-8"/><div className="grid gap-10 lg:grid-cols-2"><div className="relative aspect-square overflow-hidden border border-border bg-white"><Image src={product.gallery[0]?.url || product.image} alt={product.gallery[0]?.alt || product.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-contain"/></div><div><p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">{product.code}</p><h1 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">{product.name}</h1><p className="mt-5 text-base leading-7 text-muted">{product.description}</p><dl className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2"><div><dt className="text-xs uppercase text-muted">Material</dt><dd className="mt-1 font-medium text-primary">{product.material}</dd></div><div><dt className="text-xs uppercase text-muted">Category</dt><dd className="mt-1 font-medium text-primary">{product.category}</dd></div></dl><div className="mt-6"><h2 className="font-semibold text-primary">Applications</h2><ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted">{product.applications.map(item=><li key={item}>{item}</li>)}</ul></div><Link href="/quote" className="mt-8 inline-flex bg-[#c62828] px-5 py-3 text-sm font-semibold text-white">Request a quote</Link></div></div></Container></main><Footer/></>;
}
