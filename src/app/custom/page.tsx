import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  Factory,
  FlaskConical,
  Globe2,
  PackageCheck,
  PenTool,
  Ruler,
  ShieldCheck,
  Tags,
} from "lucide-react";
import {
  Button,
  Container,
  Footer,
  Header,
  Section,
  SectionHeading,
} from "@/components/site";

const workflow = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We review the application, operating media, temperature, pressure, drawing tolerances, and target volume.",
    icon: <PenTool aria-hidden="true" className="h-7 w-7" />,
  },
  {
    number: "02",
    title: "Prototyping",
    description:
      "CAD/CAM review, mold development, and rapid samples verify geometry and fit before production tooling is released.",
    icon: <Ruler aria-hidden="true" className="h-7 w-7" />,
  },
  {
    number: "03",
    title: "Compounding",
    description:
      "NBR, HNBR, FKM, FFKM, EPDM, and silicone formulations are selected around the required service conditions.",
    icon: <FlaskConical aria-hidden="true" className="h-7 w-7" />,
  },
  {
    number: "04",
    title: "Mass production",
    description:
      "Controlled molding, batch inspection, traceable packing, and documented release support repeatable supply.",
    icon: <Factory aria-hidden="true" className="h-7 w-7" />,
  },
] as const;

const materialRows = [
  ["NBR (Nitrile)", "-40 to +120°C", "Oil and hydraulic fluids"],
  ["HNBR", "-40 to +150°C", "Heat, wear, and refrigerants"],
  ["FKM", "-20 to +250°C", "Chemicals, fuels, and heat"],
  ["FFKM", "-20 to +320°C", "Aggressive chemicals and vacuum"],
  ["VMQ (Silicone)", "-60 to +200°C", "Food, medical, and low temperature"],
] as const;

const capabilities = [
  {
    title: "Mold design",
    description:
      "In-house tooling review for complex profiles, insert-molded parts, and precision sealing geometries.",
    icon: <Boxes aria-hidden="true" className="h-6 w-6" />,
  },
  {
    title: "Private labeling",
    description:
      "Custom kits, identification, labels, and export-ready packaging aligned with your brand and channel.",
    icon: <Tags aria-hidden="true" className="h-6 w-6" />,
  },
  {
    title: "Quality control",
    description:
      "Material, dimensional, and visual checks are documented against agreed drawings and acceptance criteria.",
    icon: <ShieldCheck aria-hidden="true" className="h-6 w-6" />,
  },
  {
    title: "Global logistics",
    description:
      "Consolidated shipments, repeat-order planning, and flexible lot sizes support international supply programs.",
    icon: <Globe2 aria-hidden="true" className="h-6 w-6" />,
  },
] as const;

const caseStudies = [
  {
    category: "Industrial equipment",
    title: "High-pressure sealing development",
    description:
      "A custom FKM sealing set was developed around a compact metal housing, combining dimensional review, compound selection, and fit verification before volume release.",
    image: "/stitch/custom-02.jpg",
    alt: "Engineer fitting a custom blue seal into a precision metal assembly",
    facts: ["Drawing-controlled", "Pressure validated"],
  },
  {
    category: "OEM kit fulfillment",
    title: "Clean, traceable private-label supply",
    description:
      "A repeat-order program combines application-specific silicone components with controlled inspection, labeled inner packs, and export-ready outer packaging.",
    image: "/stitch/custom-03.jpg",
    alt: "Clean automated line packing custom OEM sealing components",
    facts: ["Lot traceability", "Custom packaging"],
  },
] as const;

export default function CustomSolutionsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="overflow-hidden bg-primary-container py-16 text-white sm:py-20 lg:py-28">
          <Container className="grid max-w-[1280px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Precision engineering
              </p>
              <h1 className="mt-4 max-w-[14ch] text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[56px]">
                Custom O-Ring Sets &amp; OEM/ODM Solutions
              </h1>
              <p className="mt-6 max-w-[58ch] text-base leading-7 text-white/74 sm:text-lg">
                Tailored sealing solutions for demanding environments. From material
                selection and tooling to private-label packaging, our team supports the
                complete design-to-production cycle.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href="/quote"
                  size="lg"
                  icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
                >
                  Start project inquiry
                </Button>
                <Button
                  href="/resources"
                  size="lg"
                  variant="outline"
                  className="border-white/65 text-white hover:border-white hover:bg-white/10"
                  icon={<Download aria-hidden="true" className="h-4 w-4" />}
                >
                  Technical data sheets
                </Button>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden border border-white/15 bg-primary lg:aspect-[4/3]">
              <Image
                src="/stitch/custom-01.jpg"
                alt="Custom engineered O-rings arranged by color and compound in a technical laboratory"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/20 bg-primary/88 px-5 py-4 text-xs text-white/75">
                <span className="font-mono uppercase">Compound + geometry + finish</span>
                <span className="inline-flex items-center gap-2 text-white">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                  Drawing controlled
                </span>
              </div>
            </div>
          </Container>
        </section>

        <Section tone="white">
          <SectionHeading
            align="center"
            eyebrow="Engineering workflow"
            title="Design-to-Production Workflow"
            description="A structured development path keeps application requirements, samples, tooling, and production release aligned."
          />
          <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((step, index) => (
              <li
                key={step.number}
                className="relative min-h-64 border border-border bg-white p-6 transition-colors hover:border-primary/55 sm:p-7"
              >
                {index < workflow.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-5 top-12 z-10 hidden h-px w-5 bg-border xl:block"
                  />
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center bg-primary-container font-mono text-sm font-semibold text-white">
                    {step.number}
                  </span>
                  <span className="text-primary/25">{step.icon}</span>
                </div>
                <h2 className="mt-7 text-xl font-semibold text-primary">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section tone="muted">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                Compound engineering
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-primary">
                Advanced Material Selection Guide
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-muted">
                Seal life depends on the complete service environment. These ranges are
                starting points; final selection is confirmed against media, pressure,
                motion, and regulatory requirements.
              </p>

              <div className="table-scroll mt-8 border border-border bg-white">
                <table className="data-table">
                  <caption className="sr-only">
                    Custom sealing material temperature ranges and typical resistance
                  </caption>
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Typical range</th>
                      <th>Common fit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialRows.map(([material, temperature, resistance]) => (
                      <tr key={material}>
                        <td className="font-semibold text-primary">{material}</td>
                        <td>{temperature}</td>
                        <td>{resistance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                href="/materials"
                variant="link"
                className="mt-7"
                icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
              >
                Compare material families
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <article key={capability.title} className="border border-border bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center bg-surface-low text-primary">
                    {capability.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-primary">{capability.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{capability.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading
            eyebrow="Selected programs"
            title="Case Studies"
            description="Representative development paths for engineered sealing and repeat-order fulfillment."
          />
          <div className="space-y-7">
            {caseStudies.map((study, index) => (
              <article
                key={study.title}
                className="grid overflow-hidden border border-border bg-surface-low lg:grid-cols-2"
              >
                <div className={`relative min-h-72 lg:min-h-[390px] ${index % 2 ? "lg:order-2" : ""}`}>
                  <Image
                    src={study.image}
                    alt={study.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className={`flex flex-col justify-center p-7 sm:p-10 lg:p-12 ${index % 2 ? "lg:order-1" : ""}`}>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {study.category}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-primary sm:text-3xl">
                    {study.title}
                  </h2>
                  <p className="mt-5 leading-7 text-muted">{study.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {study.facts.map((fact) => (
                      <span
                        key={fact}
                        className="border border-border bg-white px-3 py-2 font-mono text-[11px] font-medium uppercase text-primary"
                      >
                        {fact}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <section className="bg-primary py-16 text-white sm:py-20">
          <Container className="max-w-4xl text-center">
            <PackageCheck aria-hidden="true" className="mx-auto h-10 w-10 text-white/55" />
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to Engineer Your Custom Solution?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
              Send a drawing, operating conditions, or a sample reference. Our team will
              review feasibility and prepare the next technical step.
            </p>
            <form action="/quote" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label htmlFor="custom-work-email" className="sr-only">
                Work email
              </label>
              <input
                id="custom-work-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Your work email"
                className="min-h-13 flex-1 border border-white/25 bg-white px-4 text-primary outline-none placeholder:text-muted/65 focus:border-white focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="inline-flex min-h-13 items-center justify-center gap-2 bg-accent px-7 font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                Get started
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase text-white/55 sm:text-xs">
              <span>Drawing review</span>
              <span>Material recommendation</span>
              <span>Production quotation</span>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
