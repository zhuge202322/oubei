"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, FlaskConical, Thermometer, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  Breadcrumbs,
  Container,
  Footer,
  Header,
  SectionHeading,
  materials,
  cx,
} from "@/components/site";

const materialVisuals: Record<string, { image: string; alt: string; applications: string[]; color: string }> = {
  nbr: {
    image: "/stitch/products-05.jpg",
    alt: "Black and green rubber O-rings used for NBR sealing applications",
    applications: ["Hydraulics", "Automotive", "General industry"],
    color: "bg-[#1f2937]",
  },
  fkm: {
    image: "/stitch/product-detail-01.jpg",
    alt: "FKM O-rings arranged by size on a technical measurement chart",
    applications: ["Chemical processing", "Fuel systems", "Aerospace"],
    color: "bg-[#2e7d32]",
  },
  vmq: {
    image: "/stitch/product-detail-06.jpg",
    alt: "Red silicone rubber O-rings on a clean machined surface",
    applications: ["Medical", "Food and beverage", "Outdoor equipment"],
    color: "bg-[#c62828]",
  },
  epdm: {
    image: "/stitch/product-detail-09.jpg",
    alt: "White translucent EPDM sealing rings beside a precision fitting",
    applications: ["Water systems", "Steam", "Outdoor equipment"],
    color: "bg-[#1565c0]",
  },
};

const applicationFilters = ["All materials", "Oil & fuel", "High temperature", "Food & medical", "Water & weather"] as const;

function matchesApplication(slug: string, filter: (typeof applicationFilters)[number]) {
  if (filter === "All materials") return true;
  if (filter === "Oil & fuel") return slug === "nbr" || slug === "fkm";
  if (filter === "High temperature") return slug === "fkm" || slug === "vmq";
  if (filter === "Food & medical") return slug === "vmq";
  return slug === "epdm";
}

export default function MaterialsPage() {
  const [filter, setFilter] = useState<(typeof applicationFilters)[number]>("All materials");
  const [activeMaterial, setActiveMaterial] = useState("fkm");

  const visibleMaterials = useMemo(() => materials.filter((material) => matchesApplication(material.slug, filter)), [filter]);
  const selectedMaterial = materials.find((material) => material.slug === activeMaterial) ?? materials[0];
  const selectedVisual = materialVisuals[selectedMaterial.slug];

  return (
    <>
      <Header activePath="/materials" />
      <main className="bg-background">
        <section className="bg-primary text-white">
          <Container className="py-12 sm:py-16 lg:py-20">
            <Breadcrumbs items={[{ label: "Solutions", href: "/materials" }, { label: "Material selection" }]} dark className="mb-8" />
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div><p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Material engineering</p><h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-tight sm:text-5xl">Choose the right compound for every seal.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Compare temperature windows, chemical resistance, and qualification options with a material recommendation backed by our engineering team.</p></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="border border-white/20 bg-white/5 p-4"><Thermometer aria-hidden="true" className="h-5 w-5 text-white/70" /><p className="mt-4 font-mono text-2xl text-white">-60 to 250°C</p><p className="mt-1 text-xs text-white/60">service range</p></div><div className="border border-white/20 bg-white/5 p-4"><Waves aria-hidden="true" className="h-5 w-5 text-white/70" /><p className="mt-4 font-mono text-2xl text-white">4 core</p><p className="mt-1 text-xs text-white/60">compound families</p></div><div className="col-span-2 border border-white/20 bg-white/5 p-4 sm:col-span-1"><FlaskConical aria-hidden="true" className="h-5 w-5 text-white/70" /><p className="mt-4 font-mono text-2xl text-white">ISO 9001</p><p className="mt-1 text-xs text-white/60">batch traceability</p></div></div>
            </div>
          </Container>
        </section>

        <section className="border-b border-border bg-white">
          <Container className="py-5"><div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Material filters">{applicationFilters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={cx("whitespace-nowrap rounded-sm border px-4 py-2 text-sm font-semibold transition-colors", filter === item ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary hover:text-primary")}>{item}</button>)}</div></Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20 lg:py-24">
            <SectionHeading eyebrow="Compound library" title="Material categories" description="Start with a proven base compound, then tune hardness, color, and approvals to your assembly." />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{visibleMaterials.map((material) => { const visual = materialVisuals[material.slug]; const active = material.slug === activeMaterial; return <button key={material.slug} type="button" onClick={() => setActiveMaterial(material.slug)} className={cx("group text-left", active && "outline-none")} aria-pressed={active}><article className={cx("h-full border bg-white transition-shadow", active ? "border-primary shadow-md" : "border-border hover:shadow-md")}><div className="relative aspect-[1.35] overflow-hidden bg-surface-low"><Image src={visual.image} alt={visual.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><span className={cx("absolute left-3 top-3 h-3 w-3 rounded-full ring-2 ring-white", visual.color)} title={`${material.shortName} family`} /></div><div className="flex h-full flex-col p-5"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{material.code}</p><h2 className="mt-2 text-xl font-semibold text-primary">{material.shortName}</h2><p className="mt-3 text-sm leading-6 text-muted">{material.description}</p><dl className="mt-5 space-y-2 border-t border-border pt-4 font-mono text-[11px] text-muted"><div className="flex justify-between gap-3"><dt>Temperature</dt><dd className="font-semibold text-primary">{material.temperature}</dd></div><div className="flex justify-between gap-3"><dt>Hardness</dt><dd className="font-semibold text-primary">{material.hardness}</dd></div></dl><div className="mt-5 flex flex-wrap gap-2">{visual.applications.map((application) => <span key={application} className="bg-surface-low px-2 py-1 text-[10px] font-medium text-muted">{application}</span>)}</div><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">View technical profile <ArrowRight aria-hidden="true" className="h-4 w-4" /></span></div></article></button>; })}</div>
            {visibleMaterials.length === 0 ? <div className="border border-dashed border-border bg-white p-10 text-center text-muted">No material family matches this application filter.</div> : null}
          </Container>
        </section>

        <section className="border-y border-border bg-surface-low">
          <Container className="py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Selected profile</p><h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">{selectedMaterial.name}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted">{selectedMaterial.description} Use this profile as a starting point, then send your drawing and target media for an engineering review.</p><ul className="mt-7 space-y-3 text-sm text-muted">{selectedMaterial.features.map((feature) => <li key={feature} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{feature}</li>)}</ul><Button href="/quote" className="mt-8" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Request material guidance</Button></div>
              <div className="relative min-h-[360px] overflow-hidden bg-white"><Image src={selectedVisual.image} alt={selectedVisual.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-primary/90 p-5 text-white sm:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{selectedMaterial.code}</p><p className="mt-1 text-lg font-semibold">{selectedMaterial.shortName}</p></div><div className="font-mono text-right text-xs text-white/75"><p>{selectedMaterial.temperature}</p><p className="mt-1">{selectedMaterial.hardness}</p></div></div></div></div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20 lg:py-24">
            <SectionHeading align="center" eyebrow="Engineering comparison" title="Performance at a glance" description="Use the matrix to shortlist a compound before we validate the final design conditions." />
            <div className="table-scroll border border-border bg-white"><table className="data-table min-w-[760px]"><thead><tr><th>Material</th><th>Temperature</th><th>Oil / fuel</th><th>Weather / ozone</th><th>Approvals</th><th>Typical use</th></tr></thead><tbody>{materials.map((material) => <tr key={material.slug}><td className="font-semibold text-primary">{material.shortName}</td><td>{material.temperature}</td><td>{material.slug === "nbr" || material.slug === "fkm" ? "Excellent" : material.slug === "vmq" ? "Good" : "Limited"}</td><td>{material.slug === "epdm" || material.slug === "vmq" ? "Excellent" : "Good"}</td><td>{material.slug === "vmq" ? "FDA / EU options" : material.slug === "fkm" ? "RoHS options" : "ISO grades"}</td><td>{material.bestFor}</td></tr>)}</tbody></table></div>
          </Container>
        </section>

        <section className="border-t border-border bg-primary">
          <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center"><div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">Need a recommendation?</p><h2 className="mt-2 text-2xl font-semibold text-white">Send your media, temperature, and drawing.</h2></div><Link href="/quote" className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Talk to an engineer <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
