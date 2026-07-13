import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Download,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Container,
  Footer,
  Header,
  Section,
  SectionHeading,
} from "@/components/site";

export const metadata = {
  title: "Engineering resources",
  description:
    "Technical guides, testing notes, quality documentation, and application insights from Xingtai Oubei sealing engineers.",
};

type ResourceCard = {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  alt: string;
  href: string;
  readingTime: string;
  label: string;
};

const resourceCards: ResourceCard[] = [
  {
    title: "Material selection handbook for industrial seals",
    category: "Technical guide",
    excerpt:
      "Compare temperature, fluid compatibility, compression set, and cost before you lock a compound into a drawing.",
    image: "/stitch/resources-01.jpg",
    alt: "O-rings arranged over a technical drawing in a test laboratory",
    href: "/resources/technical-whitepapers/high-temperature-o-ring-material",
    readingTime: "8 min read",
    label: "Featured",
  },
  {
    title: "How we measure tensile strength and elongation",
    category: "Testing note",
    excerpt:
      "A visual tour of the test method, sample preparation, and reporting controls behind every batch release.",
    image: "/stitch/resources-02.jpg",
    alt: "Universal tensile testing machine in the quality laboratory",
    href: "/resources/choosing-o-ring-hardness",
    readingTime: "5 min read",
    label: "Lab note",
  },
  {
    title: "Global connectivity starts with traceable supply",
    category: "Company update",
    excerpt:
      "What our engineering and logistics teams bring to trade shows, supplier audits, and long-term programs.",
    image: "/stitch/resources-03.jpg",
    alt: "Rubber and plastic sealing solutions exhibition booth",
    href: "/about",
    readingTime: "4 min read",
    label: "Update",
  },
  {
    title: "Rotary seal design: controlling friction and leakage",
    category: "Application note",
    excerpt:
      "Profile geometry, shaft finish, and lubrication choices that help rotating equipment run cleanly for longer.",
    image: "/stitch/resources-04.jpg",
    alt: "Rotary shaft seal installed in an industrial machine",
    href: "/products",
    readingTime: "7 min read",
    label: "Application",
  },
  {
    title: "A faster path from compound chemistry to production",
    category: "Engineering brief",
    excerpt:
      "Use our materials library to move from an application constraint to a validated compound recommendation.",
    image: "/stitch/resources-05.jpg",
    alt: "Engineer reviewing molecular material data in a digital lab",
    href: "/materials",
    readingTime: "6 min read",
    label: "Engineering",
  },
  {
    title: "Quality systems and certificates",
    category: "Quality",
    excerpt:
      "See how ISO 9001 controls, lot traceability, and incoming inspection support consistent global deliveries.",
    image: "/stitch/resources-06.jpg",
    alt: "Quality certificates displayed in an office",
    href: "/about#quality",
    readingTime: "3 min read",
    label: "Quality",
  },
  {
    title: "Dimensional inspection for molded sealing parts",
    category: "Testing note",
    excerpt:
      "The measurement sequence we use to verify critical dimensions, flash, concentricity, and surface finish.",
    image: "/stitch/resources-07.jpg",
    alt: "Quality engineer measuring a molded rubber sealing component",
    href: "/quote",
    readingTime: "5 min read",
    label: "Lab note",
  },
];

const categories = [
  { label: "All resources", href: "#resource-library" },
  { label: "Technical guides", href: "#technical-guides" },
  { label: "Testing notes", href: "#testing-notes" },
  { label: "Quality", href: "#quality" },
];

export default function ResourcesPage() {
  const featured = resourceCards[0];
  const secondary = resourceCards.slice(1, 3);
  const library = resourceCards.slice(3);

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-primary text-white">
          <Container className="relative py-14 sm:py-20 lg:py-24">
            <Breadcrumbs
              dark
              items={[{ label: "Resources" }]}
              className="mb-12"
            />
            <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff7d7d]">
                  Knowledge center / 01
                </p>
                <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                  Engineering resources
                </h1>
                <p className="mt-6 max-w-[56ch] text-base leading-7 text-white/72 sm:text-lg">
                  Practical material guidance, test methods, and application notes for teams designing reliable sealing systems.
                </p>
                <nav aria-label="Resource categories" className="mt-9 flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <a
                      key={category.href}
                      href={category.href}
                      className={
                        index === 0
                          ? "inline-flex min-h-10 items-center border border-white bg-white px-4 text-sm font-semibold text-primary"
                          : "inline-flex min-h-10 items-center border border-white/25 px-4 text-sm text-white/72 transition-colors hover:border-white/70 hover:text-white"
                      }
                    >
                      {category.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden border border-white/20 bg-primary-container/60">
                <Image
                  src="/stitch/resources-01.jpg"
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 52vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                    <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                    Featured guide
                  </div>
                  <p className="mt-2 max-w-lg text-xl font-semibold leading-tight sm:text-2xl">
                    {featured.title}
                  </p>
                </div>
              </div>
            </div>
          </Container>
          <div className="border-t border-white/15 bg-primary-container/55">
            <Container className="grid divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { value: "20+", label: "Years of sealing know-how", icon: FlaskConical },
                { value: "ISO 9001", label: "Quality system in operation", icon: ShieldCheck },
                { value: "48 h", label: "Typical drawing review", icon: Clock3 },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-4 px-1 py-5 sm:px-7 lg:py-6">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#ff7d7d]" />
                    <div>
                      <p className="font-mono text-lg font-semibold text-white">{stat.value}</p>
                      <p className="mt-0.5 text-xs text-white/58">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </Container>
          </div>
        </section>

        <Section tone="white" id="technical-guides">
          <SectionHeading
            eyebrow="Start with the essentials"
            title="Guidance for your next sealing decision"
            description="Short, practical reads written for design engineers, quality teams, and purchasing partners."
            action={
              <Button href="/quote" variant="link" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
                Ask an engineer
              </Button>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="group relative min-h-[420px] overflow-hidden border border-border bg-primary text-white">
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8c8c]">{featured.category}</p>
                <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">{featured.excerpt}</p>
                <Link href={featured.href} className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-[#ff8c8c] hover:text-[#ffb1b1]">
                  Read the guide
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </article>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {secondary.map((resource) => (
                <article key={resource.title} className="grid gap-5 border-b border-border pb-6 sm:grid-cols-[150px_1fr] sm:border-b-0 sm:pb-0 lg:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-low">
                    <Image src={resource.image} alt={resource.alt} fill sizes="180px" className="object-cover transition-transform duration-300 hover:scale-[1.03]" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c62828]">{resource.category}</p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-primary">{resource.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{resource.excerpt}</p>
                    <Link href={resource.href} className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary underline decoration-border underline-offset-4 transition-colors hover:text-[#c62828]">
                      Open resource <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="default" id="resource-library">
          <SectionHeading
            eyebrow="Resource library"
            title="Browse by application and discipline"
            description="Keep these notes close when a specification changes, a test result surprises you, or a launch date moves closer."
          />
          <div className="grid gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {library.map((resource) => (
              <article id={resource.category === "Quality" ? "quality" : undefined} key={resource.title} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden border border-border bg-surface-low">
                  <Image src={resource.image} alt={resource.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute left-3 top-3 bg-white/95 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-primary">{resource.label}</span>
                </div>
                <div className="flex flex-1 flex-col pt-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c62828]">{resource.category}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-primary">{resource.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{resource.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> {resource.readingTime}</span>
                    <Link href={resource.href} aria-label={`Read ${resource.title}`} className="grid h-10 w-10 place-items-center border border-border text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white">
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <section id="testing-notes" className="border-t border-border bg-surface-low py-12 sm:py-16">
          <Container className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">Need a document?</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">Request a tailored technical pack</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Send us your drawing, media, and target volumes. We will return a focused recommendation instead of a generic catalog.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/quote" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Start a technical review</Button>
              <Button href="/about#quality" variant="outline" icon={<Download aria-hidden="true" className="h-4 w-4" />}>Quality documentation</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
