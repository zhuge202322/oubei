"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  SlidersHorizontal,
  Verified,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  Breadcrumbs,
  Container,
  Footer,
  Header,
  cx,
} from "@/components/site";

type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  material: string[];
  hardness: string[];
  colors: string[];
  badge?: string;
  badgeClass?: string;
  label: string;
  href?: string;
};

const materialFilters = ["NBR", "FKM", "EPDM", "Silicone"] as const;
const hardnessFilters = ["60 ShA", "70 ShA", "80 ShA", "90 ShA"] as const;
const productsPerPage = 3;
const colorFilters = [
  { id: "black", label: "Black", swatch: "bg-black" },
  { id: "red", label: "Red", swatch: "bg-[#c62828]" },
  { id: "green", label: "Green", swatch: "bg-[#2e7d32]" },
  { id: "blue", label: "Blue", swatch: "bg-[#1565c0]" },
  { id: "clear", label: "Translucent", swatch: "bg-[#e0e0e0]" },
] as const;

const catalogProducts: CatalogProduct[] = [
  {
    id: "fkm-rubber-o-ring",
    name: "FKM RUBBER O RING",
    description: "Premium Viton material for extreme temperature and chemical resistance applications.",
    image: "/stitch/products-01.jpg",
    alt: "Black, green, and brown FKM rubber O-rings arranged on a white surface",
    material: ["FKM"],
    hardness: ["70 ShA", "80 ShA", "90 ShA"],
    colors: ["black", "green", "brown"],
    badge: "High Temp",
    label: "ISO 3601",
    href: "/products/fkm-rubber-o-ring",
  },
  {
    id: "ac-compressor-seal",
    name: "Air Conditioning Compressor Seal O Ring",
    description: "HNBR specialized seals for automotive cooling systems and refrigerant compatibility.",
    image: "/stitch/products-02.jpg",
    alt: "Green air conditioning compressor O-ring seals on a technical grey surface",
    material: ["NBR", "FKM"],
    hardness: ["70 ShA", "80 ShA"],
    colors: ["green"],
    label: "HNBR",
  },
  {
    id: "silicone-seal",
    name: "Silicone Rubber O Ring Seal",
    description: "FDA compliant silicone seals for medical, food, and beverage industry applications.",
    image: "/stitch/products-03.jpg",
    alt: "Rows of red silicone rubber O-rings in a clean production tray",
    material: ["Silicone"],
    hardness: ["60 ShA", "70 ShA"],
    colors: ["red", "clear"],
    badge: "Food Grade",
    badgeClass: "bg-[#2e7d32]",
    label: "VMQ",
  },
  {
    id: "o-ring-repair-kit",
    name: "O Ring Box FPM FKM NBR Silicone EPDM",
    description: "Assorted industrial kits for maintenance and rapid prototyping across all major materials.",
    image: "/stitch/products-04.jpg",
    alt: "Red organizer case with neatly separated O-ring sizes and a technical chart",
    material: ["NBR", "FKM", "EPDM", "Silicone"],
    hardness: ["60 ShA", "70 ShA", "80 ShA", "90 ShA"],
    colors: ["black", "red", "green", "clear"],
    label: "Kit",
  },
  {
    id: "standard-o-ring",
    name: "O RING",
    description: "Standard metric and imperial sized seals for universal industrial sealing applications.",
    image: "/stitch/products-05.jpg",
    alt: "Interconnected multicolor rubber O-rings on a white studio background",
    material: ["NBR", "FKM", "EPDM", "Silicone"],
    hardness: ["60 ShA", "70 ShA", "80 ShA", "90 ShA"],
    colors: ["black", "red", "green", "clear"],
    label: "Custom",
  },
  {
    id: "hydraulic-pneumatic-seals",
    name: "Hydraulic & Pneumatic Seals",
    description: "Reinforced seals designed for high-pressure piston and rod applications in heavy machinery.",
    image: "/stitch/products-06.jpg",
    alt: "Dark hydraulic and pneumatic seal profiles arranged on a white surface",
    material: ["NBR", "FKM"],
    hardness: ["70 ShA", "80 ShA", "90 ShA"],
    colors: ["black"],
    label: "Heavy Duty",
  },
];

function matchesSelection(product: CatalogProduct, selectedMaterials: string[], selectedHardness: string[], selectedColor: string | null) {
  const materialMatch = selectedMaterials.length === 0 || selectedMaterials.some((item) => product.material.includes(item));
  const hardnessMatch = selectedHardness.length === 0 || selectedHardness.some((item) => product.hardness.includes(item));
  const colorMatch = !selectedColor || product.colors.includes(selectedColor);
  return materialMatch && hardnessMatch && colorMatch;
}

export default function ProductsPage() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedHardness, setSelectedHardness] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const filtered = catalogProducts.filter((product) => matchesSelection(product, selectedMaterials, selectedHardness, selectedColor));
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "material") return a.material[0].localeCompare(b.material[0]);
      return 0;
    });
  }, [selectedColor, selectedHardness, selectedMaterials, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const toggleListFilter = (value: string, setter: (values: string[]) => void, values: string[]) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedMaterials([]);
    setSelectedHardness([]);
    setSelectedColor(null);
    setPage(1);
  };

  return (
    <>
      <Header activePath="/products" />
      <main className="bg-background">
        <Container className="py-8 sm:py-10 lg:py-12">
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: "O-Rings & Sealing Solutions" },
            ]}
            className="mb-8"
          />

          <div className="mb-5 flex items-center justify-between gap-3 md:hidden">
            <h1 className="text-xl font-semibold text-primary">Precision O-Rings</h1>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-white px-3 text-sm font-semibold text-primary"
              aria-expanded={filtersOpen}
              aria-controls="catalog-filters"
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
            <aside id="catalog-filters" className={cx("space-y-6 md:col-span-3 md:block", filtersOpen ? "block" : "hidden")}>
              <div className="border border-border bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-primary">Filters</h2>
                  <button type="button" onClick={clearFilters} className="text-xs font-semibold text-accent hover:underline">
                    Clear all
                  </button>
                </div>

                <fieldset className="mt-6">
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Material</legend>
                  <div className="mt-2 space-y-1">
                    {materialFilters.map((material) => {
                      const checked = selectedMaterials.includes(material);
                      return (
                        <label key={material} className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-sm hover:bg-surface-low">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleListFilter(material, setSelectedMaterials, selectedMaterials)}
                            className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary"
                          />
                          <span className={cx(checked ? "font-semibold text-primary" : "text-foreground")}>{material === "NBR" ? "NBR (Nitrile)" : material === "FKM" ? "FKM (Viton)" : material}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Hardness (Shore A)</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {hardnessFilters.map((hardness) => {
                      const selected = selectedHardness.includes(hardness);
                      return (
                        <button
                          key={hardness}
                          type="button"
                          onClick={() => toggleListFilter(hardness, setSelectedHardness, selectedHardness)}
                          className={cx("rounded-sm border p-2 text-xs font-medium transition-colors", selected ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border text-muted hover:border-primary")}
                          aria-pressed={selected}
                        >
                          {hardness}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Color</legend>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {colorFilters.map((color) => {
                      const selected = selectedColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          title={color.label}
                          aria-label={`Filter by ${color.label}`}
                          aria-pressed={selected}
                          onClick={() => {
                            setSelectedColor(selected ? null : color.id);
                            setPage(1);
                          }}
                          className={cx("grid h-8 w-8 place-items-center rounded-full border border-border", selected && "ring-2 ring-primary ring-offset-2")}
                        >
                          <span aria-hidden="true" className={cx("h-6 w-6 rounded-full border border-black/10", color.swatch)} />
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="bg-primary p-5 text-on-primary sm:p-6">
                <Verified aria-hidden="true" className="mb-3 h-9 w-9" />
                <h2 className="text-xl font-semibold">ISO Certified</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">All products undergo 100% optical inspection and material batch testing.</p>
              </div>
            </aside>

            <section className="md:col-span-9" aria-labelledby="catalog-title">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 id="catalog-title" className="hidden text-2xl font-semibold text-primary md:block">Precision O-Rings</h1>
                <label className="flex items-center gap-2 text-sm text-muted sm:ml-auto">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em]">Sort by:</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-sm border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="relevance">Relevance</option>
                    <option value="material">Material (A-Z)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </label>
              </div>

              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <article key={product.id} className="group flex flex-col border border-border bg-white transition-shadow hover:shadow-lg">
                      <Link href={product.href ?? "/quote"} className="relative aspect-square overflow-hidden border-b border-border bg-surface-low">
                        <Image src={product.image} alt={product.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 28vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        {product.badge ? <span className={cx("absolute right-2 top-2 px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white", product.badgeClass ?? "bg-primary")}>{product.badge}</span> : null}
                      </Link>
                      <div className="flex flex-1 flex-col p-4">
                        <h2 className="text-lg font-semibold leading-tight text-primary"><Link href={product.href ?? "/quote"} className="hover:underline">{product.name}</Link></h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                          <span className="bg-surface-low px-2 py-1 font-mono text-[10px] text-muted">{product.label}</span>
                          <Button href="/quote" variant="link" size="sm" className="shrink-0 text-accent" icon={<Mail aria-hidden="true" className="h-4 w-4" />}>Inquire Now</Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border bg-white p-10 text-center">
                  <p className="text-lg font-semibold text-primary">No products match these filters.</p>
                  <button type="button" onClick={clearFilters} className="mt-3 text-sm font-semibold text-accent hover:underline">Clear filters and view all products</button>
                </div>
              )}

              {visibleProducts.length > 0 ? (
                <nav aria-label="Catalog pagination" className="mt-12 flex items-center justify-center gap-2">
                  <button type="button" title="Previous page" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(Math.max(1, currentPage - 1))} className="grid h-10 w-10 place-items-center rounded-sm border border-border text-muted transition-colors hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} type="button" onClick={() => setPage(item)} aria-current={currentPage === item ? "page" : undefined} aria-label={`Page ${item}`} className={cx("grid h-10 w-10 place-items-center rounded-sm border text-sm", currentPage === item ? "border-primary bg-primary font-semibold text-white" : "border-border text-muted hover:bg-surface-low")}>{item}</button>)}
                  <button type="button" title="Next page" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(Math.min(totalPages, currentPage + 1))} className="grid h-10 w-10 place-items-center rounded-sm border border-border text-muted transition-colors hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight aria-hidden="true" className="h-4 w-4" /></button>
                </nav>
              ) : null}
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
