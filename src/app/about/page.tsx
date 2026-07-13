import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  FlaskConical,
  Globe2,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import {
  Button,
  Container,
  Footer,
  Header,
  Section,
  SectionHeading,
} from "@/components/site";

const trustBadges = [
  { image: "/stitch/about-02.jpg", label: "ISO 9001 quality system" },
  { image: "/stitch/about-03.jpg", label: "SGS quality verification" },
  { image: "/stitch/about-04.jpg", label: "RoHS compliance" },
  { image: "/stitch/about-05.jpg", label: "Automotive quality controls" },
  { image: "/stitch/about-06.jpg", label: "International audit readiness" },
] as const;

const certificateDocuments = [
  {
    image: "/certificates/1.png",
    title: "Credit management certificate",
    alt: "Xingtai Oubei credit management certificate",
  },
  {
    image: "/certificates/2.png",
    title: "Environmental management system",
    alt: "Xingtai Oubei environmental management system certificate",
  },
  {
    image: "/certificates/3.png",
    title: "Quality management system",
    alt: "Xingtai Oubei quality management system certificate",
  },
] as const;

const journey = [
  {
    marker: "2022",
    title: "Company founded",
    description:
      "Xingtai Oubei was established in Hebei as a specialist manufacturer of high-performance rubber products for demanding service conditions.",
    image: "/stitch/about-08.jpg",
    alt: "Rubber molding workshop representing the company manufacturing foundation",
  },
  {
    marker: "12K+",
    title: "Integrated production base",
    description:
      "A facility of more than 12,000 square meters brings production, testing, warehousing, and export preparation into one coordinated operation.",
    image: "/stitch/about-09.jpg",
    alt: "Organized export warehouse with finished industrial rubber products",
  },
  {
    marker: "TODAY",
    title: "Technical growth",
    description:
      "A dedicated R&D team continues to refine material formulations and manufacturing processes for complex custom applications worldwide.",
    image: "/stitch/about-10.jpg",
    alt: "Modern automated rubber component production facility",
  },
] as const;

const facilities = [
  {
    title: "Precision mold workshop",
    description:
      "Tooling review and controlled mold fabrication support complex geometries and repeatable dimensional performance.",
    stitchImage: "/stitch/about-11.jpg",
    stitchAlt: "CNC machining a precision metal mold with coolant",
    realImage: "/factory/车间1.jpg",
    realAlt: "Xingtai Oubei production workshop",
  },
  {
    title: "Material testing laboratory",
    description:
      "In-house equipment supports physical property checks, dimensional verification, and formulation development.",
    stitchImage: "/stitch/about-12.jpg",
    stitchAlt: "Technician operating material testing equipment in a clean laboratory",
    realImage: "/factory/实验室.jpg",
    realAlt: "Xingtai Oubei material testing laboratory",
  },
  {
    title: "Production capacity",
    description:
      "Compression and molding resources are organized for samples, custom lots, and stable repeat-order production.",
    stitchImage: "/stitch/about-13.jpg",
    stitchAlt: "High-capacity industrial molding equipment on a clean factory floor",
    realImage: "/factory/车间2.jpg",
    realAlt: "Xingtai Oubei molding production area",
  },
] as const;

const team = [
  {
    image: "/stitch/about-14.jpg",
    title: "Leadership & strategy",
    detail: "Long-term customer value and technical investment",
    alt: "Manufacturing executive in a modern office",
  },
  {
    image: "/stitch/about-15.jpg",
    title: "Global sales",
    detail: "Responsive export communication and project coordination",
    alt: "International sales leader in a bright office",
  },
  {
    image: "/stitch/about-16.jpg",
    title: "Materials engineering",
    detail: "Compound development and application problem solving",
    alt: "Senior materials engineer reviewing technical drawings",
  },
  {
    image: "/stitch/about-17.jpg",
    title: "Operations",
    detail: "Quality, planning, and reliable order execution",
    alt: "Operations professional in a modern workplace",
  },
] as const;

const globalStats = [
  ["12,000+", "Square meter facility"],
  ["50+", "Experienced staff"],
  ["R&D", "Dedicated technical team"],
  ["Global", "Customer support"],
] as const;

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative isolate flex min-h-[560px] items-center overflow-hidden text-white sm:min-h-[620px]">
          <Image
            src="/factory/新公司大门图片.png"
            alt="Front gate and production facility of Xingtai Oubei"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[62%_58%] sm:object-[55%_58%]"
          />
          <div className="absolute inset-0 -z-10 bg-primary/70" />
          <Container className="max-w-[1280px] py-20">
            <div className="max-w-2xl">
              <span className="inline-flex bg-accent px-3 py-2 font-mono text-[11px] font-semibold uppercase text-white">
                Founded 2022
              </span>
              <h1 className="mt-5 max-w-[14ch] text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[56px]">
                Engineering Excellence in Rubber &amp; Plastic
              </h1>
              <p className="mt-6 max-w-[60ch] text-base leading-7 text-white/80 sm:text-lg">
                Xingtai Oubei specializes in the R&amp;D, production, and supply of
                high-performance rubber products for severe chemical, thermal, and
                industrial operating conditions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href="#quality"
                  size="lg"
                  icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
                >
                  View certifications
                </Button>
                <Button
                  href="#facility"
                  size="lg"
                  variant="outline"
                  className="border-white/70 text-white hover:border-white hover:bg-white/10"
                >
                  Our facilities
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section id="quality" className="scroll-mt-20 border-b border-border bg-surface-low py-14 sm:py-16">
          <Container className="max-w-[1280px]">
            <h2 className="sr-only">Quality certifications and documentation</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {trustBadges.map((badge) => (
                <figure key={badge.label} className="text-center">
                  <div className="relative mx-auto h-24 w-full max-w-44 overflow-hidden bg-white grayscale transition duration-300 hover:grayscale-0">
                    <Image
                      src={badge.image}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 50vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[10px] font-medium uppercase leading-4 text-muted sm:text-[11px]">
                    {badge.label}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-12 border-t border-border pt-10">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    Verified documents
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-primary">Quality records on file</h3>
                </div>
                <p className="max-w-lg text-sm leading-6 text-muted">
                  Available documents can be supplied with project and vendor qualification reviews.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {certificateDocuments.map((certificate) => (
                  <figure key={certificate.title} className="border border-border bg-white">
                    <div className="relative h-64 bg-surface-low">
                      <Image
                        src={certificate.image}
                        alt={certificate.alt}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-contain p-3"
                      />
                    </div>
                    <figcaption className="border-t border-border px-4 py-3 text-sm font-semibold text-primary">
                      {certificate.title}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <Section tone="white">
          <div className="grid gap-5 md:grid-cols-12">
            <article className="relative overflow-hidden bg-primary p-8 text-white md:col-span-8 sm:p-10 lg:p-12">
              <Target aria-hidden="true" className="absolute -bottom-10 -right-10 h-56 w-56 text-white/5" />
              <div className="relative z-10">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Our mission
                </p>
                <h2 className="mt-4 max-w-[18ch] text-3xl font-semibold leading-tight sm:text-4xl">
                  Solve demanding applications with reliable rubber engineering.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/72">
                  We deliver premium components and tailored solutions through focused
                  material development, controlled manufacturing, and practical technical
                  support.
                </p>
              </div>
            </article>

            <article className="bg-surface-high p-8 md:col-span-4 sm:p-10">
              <Globe2 aria-hidden="true" className="h-8 w-8 text-primary" />
              <h2 className="mt-5 text-2xl font-semibold text-primary">Our Vision</h2>
              <p className="mt-4 leading-7 text-muted">
                Become a trusted global source for high-performance elastomer components
                through materials expertise, dependable delivery, and continuous improvement.
              </p>
            </article>

            <article className="border border-border bg-surface-low p-8 md:col-span-4 sm:p-10">
              <ShieldCheck aria-hidden="true" className="h-8 w-8 text-primary" />
              <h3 className="mt-5 text-xl font-semibold text-primary">Quality First</h3>
              <p className="mt-3 leading-7 text-muted">
                Requirements are translated into controlled checks from incoming material to
                final packing.
              </p>
            </article>

            <article className="grid overflow-hidden border border-border bg-surface-highest md:col-span-8 lg:grid-cols-2">
              <div className="p-8 sm:p-10">
                <FlaskConical aria-hidden="true" className="h-8 w-8 text-primary" />
                <h3 className="mt-5 text-xl font-semibold text-primary">Innovation &amp; R&amp;D</h3>
                <p className="mt-3 leading-7 text-muted">
                  A dedicated team optimizes formulas and manufacturing processes for FFKM,
                  HNBR, FKM, and other performance materials.
                </p>
              </div>
              <div className="relative min-h-60">
                <Image
                  src="/stitch/about-07.jpg"
                  alt="Researcher examining a rubber seal under a laboratory microscope"
                  fill
                  sizes="(max-width: 1023px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </Section>

        <Section tone="muted">
          <SectionHeading
            align="center"
            eyebrow="Company development"
            title="Our Journey"
            description="A focused path from specialist manufacturing to integrated technical supply."
          />
          <div className="relative space-y-10 lg:space-y-0">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-border lg:block"
            />
            {journey.map((milestone, index) => {
              const textOnRight = index % 2 === 1;
              return (
                <article
                  key={milestone.marker}
                  className="relative grid items-center gap-6 lg:min-h-[290px] lg:grid-cols-[1fr_36px_1fr] lg:gap-10"
                >
                  <div className={textOnRight ? "lg:order-3" : "lg:order-1 lg:text-right"}>
                    <p className="font-mono text-4xl font-semibold text-primary/20 sm:text-5xl">
                      {milestone.marker}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-primary">{milestone.title}</h3>
                    <p className={`mt-3 max-w-xl leading-7 text-muted ${textOnRight ? "" : "lg:ml-auto"}`}>
                      {milestone.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="z-10 hidden h-4 w-4 place-self-center rounded-full border-4 border-white bg-accent ring-1 ring-border lg:order-2 lg:block"
                  />
                  <div className={`relative min-h-56 overflow-hidden border border-border ${textOnRight ? "lg:order-1" : "lg:order-3"}`}>
                    <Image
                      src={milestone.image}
                      alt={milestone.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 45vw"
                      className="object-cover grayscale transition duration-300 hover:grayscale-0"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <section id="facility" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-28">
          <Container className="max-w-[1280px]">
            <SectionHeading
              eyebrow="Factory capability"
              title="Manufacturing Prowess"
              description="Our 12,000+ square meter facility integrates production, testing, storage, and order preparation."
              action={
                <Button
                  href="/quote"
                  variant="secondary"
                  icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
                >
                  Discuss capacity
                </Button>
              }
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {facilities.map((facility) => (
                <article key={facility.title} className="border border-border bg-white">
                  <div className="grid aspect-[4/3] grid-cols-[1.7fr_1fr] gap-px overflow-hidden bg-border">
                    <div className="relative">
                      <Image
                        src={facility.stitchImage}
                        alt={facility.stitchAlt}
                        fill
                        sizes="(max-width: 1023px) 66vw, 23vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative">
                      <Image
                        src={facility.realImage}
                        alt={facility.realAlt}
                        fill
                        sizes="(max-width: 1023px) 34vw, 12vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl font-semibold text-primary">{facility.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{facility.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="overflow-hidden bg-primary py-16 text-white sm:py-20 lg:py-24">
          <Container className="grid max-w-[1280px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Export-ready support
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Global Customer Reach</h2>
              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Technical communication, tailored packing, and coordinated international
                shipment help customers qualify and repeat complex rubber components with
                confidence.
              </p>
              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7">
                {globalStats.map(([value, label]) => (
                  <div key={label}>
                    <dd className="text-3xl font-semibold text-white">{value}</dd>
                    <dt className="mt-1 font-mono text-[10px] uppercase leading-4 text-white/50">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[360px] border border-white/20 bg-primary-container/65">
              <Globe2
                aria-hidden="true"
                strokeWidth={0.8}
                className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 text-white/18 sm:h-64 sm:w-64"
              />
              <span aria-hidden="true" className="absolute left-1/2 top-10 h-[calc(100%-5rem)] w-px bg-white/10" />
              <span aria-hidden="true" className="absolute left-10 top-1/2 h-px w-[calc(100%-5rem)] bg-white/10" />
              <div className="absolute left-6 top-7 sm:left-10 sm:top-10">
                <MapPin aria-hidden="true" className="h-5 w-5 text-accent" />
                <p className="mt-2 text-sm font-semibold">Hebei, China</p>
                <p className="font-mono text-[9px] uppercase text-white/45">Production base</p>
              </div>
              <div className="absolute right-6 top-7 text-right sm:right-10 sm:top-10">
                <CheckCircle2 aria-hidden="true" className="ml-auto h-5 w-5 text-white/65" />
                <p className="mt-2 text-sm font-semibold">Technical review</p>
                <p className="font-mono text-[9px] uppercase text-white/45">Application support</p>
              </div>
              <div className="absolute bottom-7 left-6 sm:bottom-10 sm:left-10">
                <Factory aria-hidden="true" className="h-5 w-5 text-white/65" />
                <p className="mt-2 text-sm font-semibold">Controlled supply</p>
                <p className="font-mono text-[9px] uppercase text-white/45">Repeat production</p>
              </div>
              <div className="absolute bottom-7 right-6 text-right sm:bottom-10 sm:right-10">
                <Globe2 aria-hidden="true" className="ml-auto h-5 w-5 text-white/65" />
                <p className="mt-2 text-sm font-semibold">Worldwide delivery</p>
                <p className="font-mono text-[9px] uppercase text-white/45">Export coordination</p>
              </div>
            </div>
          </Container>
        </section>

        <Section tone="white">
          <SectionHeading
            align="center"
            eyebrow="People behind production"
            title="Specialist Team"
            description="Commercial, materials, quality, and operations expertise working around one project brief."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.title} className="group text-center">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-low">
                  <Image
                    src={member.image}
                    alt={member.alt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-primary">{member.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{member.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-primary">
              <Users aria-hidden="true" className="h-6 w-6" />
              <p className="font-semibold">More than 50 experienced team members</p>
            </div>
            <Button
              href="/quote"
              icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
            >
              Contact our team
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
