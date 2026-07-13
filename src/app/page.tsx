import Image from "next/image";
import { ArrowRight, BadgeCheck, Download } from "lucide-react";
import Hero3D from "@/components/Hero3D";
import MaterialShowcase from "@/components/MaterialShowcase";
import {
  Button,
  Container,
  Footer,
  Header,
  Section,
  SectionHeading,
  TrustIcon,
} from "@/components/site";
import {
  insights,
  manufacturingStats,
  materialComparison,
  materials,
  trustMarks,
} from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="relative isolate min-h-[calc(100dvh-73px)] overflow-hidden bg-primary text-white">
          <Hero3D />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-primary/25" />
          <Container className="pointer-events-none relative z-10 flex min-h-[calc(100dvh-73px)] items-end pb-24 pt-36 sm:items-center sm:pb-32 sm:pt-20">
            <div className="pointer-events-auto w-full max-w-[620px]">
              <div className="inline-flex items-center gap-2 border border-white/30 bg-primary/45 px-3 py-2 font-mono text-[11px] font-medium uppercase sm:mb-6">
                <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                ISO 9001:2015 Certified Manufacturer
              </div>
              <h1 className="hidden max-w-[12ch] text-4xl font-bold leading-[1.05] sm:block sm:text-5xl lg:text-[64px]">
                Precision Rubber Sealing Solutions.
              </h1>
              <p className="mt-6 hidden max-w-[58ch] text-base leading-7 text-white/78 sm:block sm:text-lg">
                Advanced rubber and plastic components for global automotive, aerospace, and industrial applications. More than 20 years of manufacturing leadership.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                <Button href="/products" size="lg" className="min-w-0 w-full !px-3 sm:w-auto sm:!px-7" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
                  Browse catalog
                </Button>
                <Button href="/materials" size="lg" variant="outline" className="min-w-0 w-full !px-3 border-white/70 text-white hover:border-white hover:bg-white/10 sm:w-auto sm:!px-7">
                  Technical specs
                </Button>
              </div>
            </div>
          </Container>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/20 bg-surface-low/96 text-primary">
            <Container className="grid grid-cols-4 divide-x divide-border">
              {trustMarks.map((item) => (
                <div key={item.label} className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-center font-mono text-[8px] font-medium uppercase leading-tight text-muted sm:min-h-20 sm:flex-row sm:gap-3 sm:px-3 sm:py-4 sm:text-xs [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                  <TrustIcon type={item.icon} />
                  <span>{item.label}</span>
                </div>
              ))}
            </Container>
          </div>
        </section>

        <Section tone="white">
          <MaterialShowcase materials={materials.slice(0, 3)} />
        </Section>

        <Section tone="navy">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="font-mono text-xs font-medium uppercase text-white/55">Factory capability</p>
              <h2 className="mt-4 max-w-[16ch] text-3xl font-semibold leading-tight text-white sm:text-4xl">Advanced Manufacturing Capacity</h2>
              <p className="mt-5 max-w-[58ch] leading-7 text-white/70">
                Our facility integrates compression and injection molding technology, zero-defect production controls, and automated optical inspection for critical seals.
              </p>
              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7">
                {manufacturingStats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-3xl font-semibold text-white">{stat.value}</dd>
                    <dt className="mt-1 font-mono text-[10px] uppercase text-white/55">{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <Button href="/about#facility" variant="outline" className="mt-9 border-white bg-white text-primary hover:bg-surface-low" icon={<Download aria-hidden="true" className="h-4 w-4" />}>
                Facility overview
              </Button>
            </div>

            <div className="grid gap-3 lg:min-h-[480px] lg:grid-cols-2 lg:grid-rows-2">
              <div className="relative aspect-[3/2] overflow-hidden lg:row-span-2 lg:aspect-auto">
                <Image src="/factory/车间1.jpg" alt="Oubei rubber molding workshop" fill sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 28vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto">
                <Image src="/factory/实验室.jpg" alt="Material testing laboratory" fill sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 28vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto">
                <Image src="/factory/成品仓.jpg" alt="Finished goods warehouse" fill sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 28vw" className="object-cover" />
              </div>
            </div>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading
            align="center"
            title="Material Property Comparison"
            description="Compare structural integrity and performance metrics for our most requested compounds."
          />
          <div className="table-scroll border border-border">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material code</th>
                  <th>Chemical name</th>
                  <th>Max temp.</th>
                  <th>Tensile strength</th>
                  <th>Best for</th>
                </tr>
              </thead>
              <tbody>
                {materialComparison.map((row) => (
                  <tr key={row.code}>
                    <td>{row.code}</td>
                    <td>{row.material}</td>
                    <td>{row.maxTemperature}</td>
                    <td>{row.tensileStrength}</td>
                    <td>{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section tone="default" className="border-t border-border">
          <SectionHeading align="center" title="Industry Insights" description="Practical guidance from our engineering and supply teams." />
          <div className="grid gap-8 md:grid-cols-3">
            {insights.map((insight) => (
              <article key={insight.slug} className="group">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-low">
                  <Image src={insight.image} alt={insight.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-5 font-mono text-[11px] font-semibold uppercase text-accent">{insight.category}</p>
                <h2 className="mt-2 text-xl font-semibold leading-snug text-primary">{insight.title}</h2>
                <p className="mt-3 line-clamp-2 leading-6 text-muted">{insight.excerpt}</p>
                <Button href={`/resources/${insight.slug}`} variant="link" size="sm" className="mt-5">Read insight</Button>
              </article>
            ))}
          </div>
        </Section>

        <section className="border-t border-primary/15 bg-surface-low py-12">
          <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs uppercase text-accent">Engineering support</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">Have a drawing or sealing challenge?</h2>
            </div>
            <Button href="/quote" size="lg" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Request a technical review</Button>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
