"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  Mail,
  Send,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  Breadcrumbs,
  Button,
  Container,
  Footer,
  Header,
  cx,
} from "@/components/site";

const galleryImages = [
  { src: "/stitch/product-detail-01.jpg", alt: "FKM O-rings arranged by size on a measurement sheet" },
  { src: "/stitch/product-detail-02.jpg", alt: "Macro detail of a black FKM O-ring surface" },
  { src: "/stitch/product-detail-03.jpg", alt: "Green FKM O-rings arranged in metric sizes" },
  { src: "/stitch/product-detail-04.jpg", alt: "Brown FKM O-rings on a quality inspection bench" },
  { src: "/stitch/product-detail-05.jpg", alt: "Technical FKM O-ring cross-section diagram in a factory" },
  { src: "/stitch/product-detail-06.jpg", alt: "Red high-temperature O-rings on a machined surface" },
  { src: "/stitch/product-detail-07.jpg", alt: "Green O-rings arranged on a sizing chart" },
  { src: "/stitch/product-detail-08.jpg", alt: "O-ring assortment case in a workshop" },
  { src: "/stitch/product-detail-09.jpg", alt: "White translucent sealing rings beside a precision fitting" },
];

const specificationRows = [
  ["HT-FKM-010", "10.00 mm", "14.00 mm", "2.00 mm", "0.08 mm"],
  ["HT-FKM-015", "15.00 mm", "20.00 mm", "2.50 mm", "0.09 mm"],
  ["HT-FKM-020", "20.00 mm", "26.00 mm", "3.00 mm", "0.10 mm"],
  ["HT-FKM-025", "25.00 mm", "32.00 mm", "3.50 mm", "0.12 mm"],
  ["HT-FKM-030", "30.00 mm", "38.00 mm", "4.00 mm", "0.14 mm"],
];

const relatedProducts = [
  {
    name: "Silicone Rubber O-Ring",
    description: "-60°C to +230°C range, FDA compliant grades available.",
    image: "/stitch/product-detail-06.jpg",
    alt: "Red silicone rubber O-rings",
  },
  {
    name: "HNBR Compressor Seals",
    description: "Superior wear resistance for dynamic sealing applications.",
    image: "/stitch/product-detail-07.jpg",
    alt: "Green HNBR O-rings arranged on a sizing sheet",
  },
  {
    name: "NBR O-Ring Repair Kits",
    description: "Metric and imperial assortments for quick emergency repairs.",
    image: "/stitch/product-detail-08.jpg",
    alt: "Red organizer case filled with black O-rings",
  },
  {
    name: "PTFE O-Rings",
    description: "Zero chemical reactivity and ultra-low friction properties.",
    image: "/stitch/product-detail-09.jpg",
    alt: "White PTFE rings and precision fitting",
  },
];

type DetailTab = "specs" | "performance" | "quality" | "certificates";

async function responseError(response: Response, fallback: string) {
  try {
    const payload = await response.json() as { error?: unknown; message?: unknown };
    if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  } catch {
    // The fallback covers empty and non-JSON error responses.
  }
  return fallback;
}

export default function FkmRubberORingPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("specs");
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [inquiryError, setInquiryError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      type: "product",
      quantity: String(formData.get("quantity") ?? ""),
      material: String(formData.get("material") ?? ""),
      email: String(formData.get("email") ?? ""),
    };

    setInquiryError("");
    setInquiryStatus("submitting");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(await responseError(response, "We could not send this inquiry. Please try again."));
      }
      setInquiryStatus("success");
    } catch (error) {
      setInquiryError(error instanceof Error && error.message ? error.message : "We could not send this inquiry. Please check your connection and try again.");
      setInquiryStatus("error");
    }
  };

  return (
    <>
      <Header activePath="/products" />
      <main className="bg-background">
        <Container className="py-8 sm:py-10 lg:py-12">
          <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: "FKM Rubber O-Ring" }]} className="mb-8" />

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <section className="space-y-4 lg:col-span-7" aria-label="Product gallery">
              <div className="relative aspect-square overflow-hidden border border-border bg-white p-2">
                <Image src={galleryImages[activeImage].src} alt={galleryImages[activeImage].alt} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-contain" />
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.slice(0, 5).map((image, index) => (
                  <button key={image.src} type="button" onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`} aria-pressed={activeImage === index} className={cx("relative aspect-square overflow-hidden border bg-white p-1", activeImage === index ? "border-2 border-primary" : "border-border hover:border-primary/50")}>
                    <Image src={image.src} alt="" fill sizes="(max-width: 639px) 20vw, 12vw" className="object-cover" />
                  </button>
                ))}
                <button type="button" onClick={() => setActiveImage(5)} aria-label="View more product images" className="relative col-span-2 aspect-[2/1] overflow-hidden border border-border bg-white p-1 sm:col-span-1 sm:aspect-square">
                  <Image src={galleryImages[5].src} alt="" fill sizes="(max-width: 639px) 40vw, 12vw" className="object-cover opacity-40" />
                  <span className="absolute inset-0 grid place-items-center text-sm font-bold text-primary">+{galleryImages.length - 5}</span>
                </button>
              </div>
            </section>

            <section className="space-y-7 lg:col-span-5" aria-labelledby="product-title">
              <div className="space-y-3">
                <span className="inline-flex rounded-sm bg-primary-container/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary-container">High-Temperature Grade</span>
                <h1 id="product-title" className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">High Performance FKM Rubber O-Ring (Viton Equivalent)</h1>
                <p className="text-sm leading-6 text-muted sm:text-base">Designed for extreme environments requiring chemical resistance and thermal stability. Ideal for aerospace, automotive, and chemical processing applications.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-sm border border-border bg-surface-low p-4">
                  <Thermometer aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                  <div><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Temp range</p><p className="mt-1 text-sm font-semibold text-foreground">-20°C to +200°C</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-sm border border-border bg-surface-low p-4">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                  <div><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Certification</p><p className="mt-1 text-sm font-semibold text-foreground">ISO 9001, RoHS</p></div>
                </div>
              </div>

              <div className="border-2 border-primary-container/20 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold text-primary">Request a Quote</h2>
                <form className="mt-5 space-y-4" onSubmit={handleSubmit} onChange={() => { if (inquiryStatus !== "submitting") { setInquiryStatus("idle"); setInquiryError(""); } }}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Quantity</span><input required min="1" disabled={inquiryStatus === "submitting"} name="quantity" type="number" placeholder="5000+" className="mt-1 h-11 w-full rounded-sm border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-wait disabled:bg-surface-low" /></label>
                    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Material</span><select name="material" disabled={inquiryStatus === "submitting"} defaultValue="FKM (75 Shore A)" className="mt-1 h-11 w-full rounded-sm border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-wait disabled:bg-surface-low"><option>FKM (75 Shore A)</option><option>FKM (90 Shore A)</option><option>Viton GLT</option></select></label>
                  </div>
                  <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Your email</span><input required name="email" disabled={inquiryStatus === "submitting"} type="email" placeholder="procurement@company.com" className="mt-1 h-11 w-full rounded-sm border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-wait disabled:bg-surface-low" /></label>
                  {inquiryStatus === "error" ? <p className="border border-[#edb4b4] bg-[#fff5f5] px-3 py-2 text-xs leading-5 text-[#8f1d1d]" role="alert">{inquiryError}</p> : null}
                  <button type="submit" disabled={inquiryStatus === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-wait disabled:opacity-60">{inquiryStatus === "submitting" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : inquiryStatus === "success" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Send aria-hidden="true" className="h-4 w-4" />}{inquiryStatus === "submitting" ? "Sending inquiry..." : inquiryStatus === "success" ? "Inquiry received" : "Send Technical Inquiry"}</button>
                </form>
                <p className="mt-4 text-center text-xs text-muted">Response time: Within 24 business hours</p>
              </div>
            </section>
          </div>

          <section className="mt-16 sm:mt-20" aria-label="Technical information">
            <div className="flex gap-6 overflow-x-auto border-b border-border" role="tablist" aria-label="Product details">
              {([
                ["specs", "Technical Specifications"],
                ["performance", "Material Performance"],
                ["quality", "Quality Testing"],
                ["certificates", "Certificates & Downloads"],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" role="tab" aria-selected={activeTab === value} onClick={() => setActiveTab(value)} className={cx("whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors", activeTab === value ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary")}>{label}</button>
              ))}
            </div>

            {activeTab === "specs" ? (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <h2 className="text-xl font-semibold text-primary">Standard Metric Specifications</h2>
                  <div className="mt-5 overflow-x-auto border border-border">
                    <table className="data-table min-w-[640px]"><thead><tr><th>Part number</th><th>Inner diameter (ID)</th><th>Outer diameter (OD)</th><th>Cross section (CS)</th><th>Tolerance (+/-)</th></tr></thead><tbody>{specificationRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={index === 0 ? "font-semibold text-primary" : undefined}>{cell}</td>)}</tr>)}</tbody></table>
                  </div>
                  <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Download aria-hidden="true" className="h-4 w-4" />Download full size chart (PDF)</button>
                </div>
                <CompatibilityPanel />
              </div>
            ) : null}

            {activeTab === "performance" ? (
              <div className="prose-copy mt-8 grid gap-6 md:grid-cols-2">
                <div className="border border-border bg-white p-6"><h2>Material performance</h2><p className="mt-3">FKM compounds maintain elasticity and sealing force across high heat, fuels, mineral oils, and aggressive chemical media. Select the compound grade and hardness against your pressure, squeeze, and extrusion conditions.</p><ul className="mt-5 space-y-3 text-sm text-muted"><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />Low compression set at elevated temperatures</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />Excellent resistance to aromatic fuels and oils</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />Traceable batch formulation and cure records</li></ul></div>
                <div className="border border-border bg-surface-low p-6"><h2>Recommended design window</h2><dl className="mt-4 divide-y divide-border font-mono text-xs"><div className="flex justify-between gap-4 py-3"><dt>Hardness</dt><dd className="font-semibold text-primary">70-90 Shore A</dd></div><div className="flex justify-between gap-4 py-3"><dt>Pressure</dt><dd className="font-semibold text-primary">Up to 25 MPa*</dd></div><div className="flex justify-between gap-4 py-3"><dt>Compression set</dt><dd className="font-semibold text-primary">&lt; 20% @ 200°C</dd></div></dl><p className="mt-4 text-xs text-muted">*Use anti-extrusion backup rings when application conditions require them.</p></div>
              </div>
            ) : null}

            {activeTab === "quality" ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><QualityCard icon={<FlaskConical aria-hidden="true" />} title="Compound verification" copy="Every batch is tested for hardness, tensile strength, elongation, and compression set." /><QualityCard icon={<ShieldCheck aria-hidden="true" />} title="100% visual inspection" copy="Automated and operator checks verify flash, surface finish, dimensions, and defects." /><QualityCard icon={<FileCheck2 aria-hidden="true" />} title="Traceable documentation" copy="Inspection records, certificates, and lot labels remain linked through shipment." /></div>
            ) : null}

            {activeTab === "certificates" ? (
              <div className="mt-8 border border-border bg-white p-6 sm:p-8"><h2 className="text-xl font-semibold text-primary">Certificates & downloads</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Share your drawing and target conditions with our engineering team. We will return a material recommendation, compliance pack, and inspection plan.</p><div className="mt-6 flex flex-wrap gap-3"><Button href="/quote" icon={<Mail aria-hidden="true" className="h-4 w-4" />}>Request compliance pack</Button><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border px-5 text-sm font-semibold text-primary hover:border-primary"><Download aria-hidden="true" className="h-4 w-4" />ISO 9001 certificate</button></div></div>
            ) : null}
          </section>

          <section className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16" aria-labelledby="related-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="related-title" className="text-2xl font-semibold text-primary">Related Sealing Solutions</h2><p className="mt-2 text-sm text-muted">Recommended alternatives for different operational requirements.</p></div><Button href="/products" variant="link" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>View all products</Button></div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((product) => <article key={product.name} className="group border border-border bg-white p-4 transition-shadow hover:shadow-md"><Link href="/products" className="relative block aspect-square overflow-hidden bg-surface-low"><Image src={product.image} alt={product.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 24vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></Link><h3 className="mt-4 text-base font-semibold text-primary">{product.name}</h3><p className="mt-2 text-xs leading-5 text-muted">{product.description}</p><Button href="/quote" variant="link" size="sm" className="mt-4 text-accent" icon={<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />}>Inquire now</Button></article>)}</div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function CompatibilityPanel() {
  const compatibility = [
    ["Petroleum oils", "Excellent", "95%", "bg-green-600"],
    ["Acids & alkalies", "High", "85%", "bg-green-600"],
    ["Aromatic hydrocarbons", "Excellent", "92%", "bg-green-600"],
    ["Steam / water", "Moderate", "45%", "bg-yellow-600"],
  ];
  return (
    <aside className="space-y-6 lg:col-span-4">
      <div className="border border-border bg-surface-highest p-5 sm:p-6"><h2 className="text-xl font-semibold text-primary">Chemical Compatibility</h2><div className="mt-5 space-y-4">{compatibility.map(([label, rating, width, color]) => <div key={label}><div className="flex justify-between gap-3 text-xs"><span>{label}</span><span className={rating === "Moderate" ? "font-semibold text-amber-700" : "font-semibold text-green-700"}>{rating}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-border"><div className={cx("h-full", color)} style={{ width }} /></div></div>)}</div></div>
      <div className="bg-primary-container p-5 text-white sm:p-6"><h2 className="text-xl font-semibold">Technical Support</h2><p className="mt-2 text-sm leading-6 text-white/75">Need help selecting the right material for your application? Our engineers are available for consulting.</p><Link href="/quote" className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4">Talk to an engineer <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
    </aside>
  );
}

function QualityCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return <article className="border border-border bg-white p-5"><div className="text-primary">{icon}</div><h2 className="mt-4 text-lg font-semibold text-primary">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{copy}</p></article>;
}
