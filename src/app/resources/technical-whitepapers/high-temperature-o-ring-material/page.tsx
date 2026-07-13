import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  FileText,
  Mail,
} from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Container,
  Footer,
  Header,
  Section,
} from "@/components/site";

export const metadata = {
  title: "High-temperature O-ring materials",
  description:
    "A practical engineering comparison of FKM, FFKM, and silicone O-ring materials for high-temperature sealing systems.",
};

type ArticleVariant = "high-temperature" | "hardness";

const articleData = {
  "high-temperature": {
    eyebrow: "Technical whitepaper / Materials",
    title: "High-temperature O-ring materials: FKM, FFKM, and silicone compared",
    intro:
      "Selecting a compound for heat is rarely a single-number decision. This guide brings temperature, media, compression set, and total cost into one practical comparison.",
    date: "March 18, 2025",
    read: "8 min read",
    calloutTitle: "Start with the operating envelope",
    calloutCopy:
      "List the continuous temperature, short excursions, media, pressure, and motion first. A material that survives a headline temperature may still fail when those conditions overlap.",
    sectionOneTitle: "1. Separate continuous temperature from peaks",
    sectionOne: [
      "The first pass is to document the temperature the seal sees for most of its service life, then record the highest short-term excursion. FKM is a strong default for many oil, fuel, and chemical environments up to roughly 200-250°C, while FFKM is reserved for the most aggressive combinations of heat and media.",
      "Silicone remains useful when flexibility, cleanliness, and a broad low-temperature range matter more than abrasion resistance. Its performance should be checked carefully where dynamic wear, sharp edges, or high tear loads are expected.",
    ],
    sectionTwoTitle: "2. Compare the trade-offs that change the result",
  },
  hardness: {
    eyebrow: "Technical guide / Design fundamentals",
    title: "How to choose the right O-ring hardness for high-pressure systems",
    intro:
      "Shore A hardness is only one part of an extrusion decision. Use it alongside squeeze, clearance, pressure, and backup-ring strategy to make a design that lasts.",
    date: "March 18, 2025",
    read: "6 min read",
    calloutTitle: "Start with pressure and clearance",
    calloutCopy:
      "A harder compound can resist extrusion, but it may need more assembly force and may seal less reliably on imperfect surfaces. Capture the pressure direction and maximum gap before choosing a grade.",
    sectionOneTitle: "1. Match hardness to the pressure window",
    sectionOne: [
      "For many static hydraulic applications, 70 Shore A is a useful starting point. Move toward 80 or 90 Shore A as pressure and extrusion risk increase, while checking that the compound still provides enough compliance for surface finish and tolerance stack-up.",
      "Hardness alone does not prevent damage. A correctly sized O-ring, controlled squeeze, compatible lubricant, and a backup ring can deliver a better result than simply moving to the hardest available material.",
    ],
    sectionTwoTitle: "2. Use squeeze and gap as a design pair",
  },
} as const;

const comparisonRows = [
  { material: "FKM", temperature: "-20 to +250°C", strengths: "Heat, oils, fuels, many chemicals", watch: "Cold flexibility and hot steam" },
  { material: "FFKM", temperature: "-15 to +325°C", strengths: "Extreme heat and chemical resistance", watch: "Cost and lead time" },
  { material: "Silicone", temperature: "-60 to +200°C", strengths: "Flexibility, cleanliness, weathering", watch: "Tear and abrasion in dynamic duty" },
];

function ArticleTable({ variant }: { variant: ArticleVariant }) {
  if (variant === "hardness") {
    return (
      <div className="table-scroll mt-7 border border-border">
        <table className="data-table min-w-[640px]">
          <thead>
            <tr>
              <th>Shore A</th>
              <th>Typical use</th>
              <th>Design note</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>60-70</td><td>Low to medium pressure, forgiving surfaces</td><td>Best compliance; check extrusion gap</td></tr>
            <tr><td>75-80</td><td>General hydraulic and pneumatic service</td><td>Balanced sealing and assembly force</td></tr>
            <tr><td>85-90</td><td>High pressure or larger clearance</td><td>Consider backup rings and chamfer quality</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-scroll mt-7 border border-border">
      <table className="data-table min-w-[700px]">
        <thead>
          <tr>
            <th>Compound</th>
            <th>Temperature window</th>
            <th>Best strengths</th>
            <th>Watch for</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.material}>
              <td className="font-semibold">{row.material}</td>
              <td>{row.temperature}</td>
              <td>{row.strengths}</td>
              <td>{row.watch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TechnicalWhitepaperPage({ variant = "high-temperature" }: { variant?: ArticleVariant }) {
  const article = articleData[variant];
  const isHardness = variant === "hardness";

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface-low">
          <Container className="py-8 sm:py-12">
            <Breadcrumbs
              items={[
                { label: "Resources", href: "/resources" },
                { label: isHardness ? "Choosing O-ring hardness" : "Technical whitepapers" },
              ]}
            />
            <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="max-w-4xl">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c62828]">{article.eyebrow}</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tight text-primary sm:text-5xl lg:text-6xl">{article.title}</h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">{article.intro}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  <span>{article.date}</span>
                  <span className="h-1 w-1 rounded-full bg-[#c62828]" aria-hidden="true" />
                  <span>{article.read}</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-border bg-white">
                <Image src="/stitch/article-01.jpg" alt="O-rings in several compounds on a laboratory workbench" fill priority sizes="(max-width: 1023px) 100vw, 360px" className="object-cover" />
              </div>
            </div>
          </Container>
        </section>

        <Section tone="white" className="!py-12 sm:!py-16 lg:!py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-20">
            <article className="prose-copy min-w-0 max-w-3xl">
              <div id="design-checkpoint" className="border-l-4 border-[#c62828] bg-surface-low px-5 py-5 sm:px-7 sm:py-6">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">Design checkpoint</p>
                <h2 className="mt-2 text-xl font-semibold text-primary">{article.calloutTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{article.calloutCopy}</p>
              </div>

              <div id="section-one" className="mt-12 space-y-5">
                <h2>{article.sectionOneTitle}</h2>
                {article.sectionOne.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <div id="section-two" className="mt-12">
                <h2>{article.sectionTwoTitle}</h2>
                <p className="mt-5">{isHardness ? "A useful way to review a drawing is to treat squeeze and extrusion gap as a pair. Radial and axial squeeze should be checked against the actual gland dimensions, surface finish, and pressure direction. When the gap cannot be reduced, a backup ring can protect the seal without forcing a compound change." : "A compound may look suitable on a temperature chart but behave differently once pressure, media, and movement are added. Review compression set, gas permeability, and dynamic friction alongside the headline service temperature. That wider view keeps the material recommendation tied to the application rather than a single data-sheet line."}</p>
                <ArticleTable variant={variant} />
              </div>

              <div className="mt-12 space-y-5">
                <h2>{isHardness ? "3. Validate the gland before release" : "3. Validate the compound in the real media"}</h2>
                <p>{isHardness ? "Before release, confirm gland fill, corner radii, lead-in chamfers, and assembly force. A short prototype run with the production surface finish is often the fastest way to reveal nicks, rolling, or installation damage." : "When the media is unfamiliar, a short immersion and compression-set test can expose a mismatch earlier than a field failure. Share the actual fluid blend, concentration, cleaning cycle, and pressure pulse with the compound supplier so the test reflects the real duty cycle."}</p>
                <p>{isHardness ? "Record the chosen hardness, squeeze, gap, and backup-ring decision on the drawing. That makes future substitutions auditable and avoids a silent change in sealing behavior." : "Document the accepted compound, cure system, hardness, and test conditions on the drawing or purchase specification. Clear documentation is the simplest way to keep an approved material consistent across suppliers and plants."}</p>
              </div>

              <div id="takeaways" className="mt-12 border-t border-border pt-8">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c62828]">Key takeaways</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(isHardness
                    ? ["Choose hardness with pressure and clearance together", "Use squeeze to manage compliance", "Add backup rings where the gap requires them", "Prototype with production finish and tooling"]
                    : ["Separate continuous temperature from short peaks", "Check media, pressure, and motion together", "Treat compression set as a life indicator", "Validate unfamiliar media before production"]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#c62828]" /> {item}</li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28">
              <div className="border border-border bg-surface-low p-5 sm:p-6">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c62828]">On this page</p>
                <nav aria-label="Article sections" className="mt-4 space-y-2 border-l border-border pl-4 text-sm text-muted">
                  <a href="#design-checkpoint" className="block transition-colors hover:text-primary">Design checkpoint</a>
                  <a href="#section-one" className="block transition-colors hover:text-primary">Operating envelope</a>
                  <a href="#section-two" className="block transition-colors hover:text-primary">Trade-offs</a>
                  <a href="#takeaways" className="block transition-colors hover:text-primary">Key takeaways</a>
                </nav>
                <div className="mt-7 border-t border-border pt-5">
                  <Button href="/quote" size="sm" className="w-full" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Review my application</Button>
                  <a href="mailto:sales@xingtaioubei.com?subject=Technical%20resource%20request" className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-border text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-white"><Mail aria-hidden="true" className="h-3.5 w-3.5" /> Email engineering sales</a>
                </div>
              </div>
              <div className="mt-5 border border-primary bg-primary p-5 text-white sm:p-6">
                <FileText aria-hidden="true" className="h-5 w-5 text-[#ff8c8c]" />
                <h2 className="mt-4 text-lg font-semibold">Need a printable copy?</h2>
                <p className="mt-2 text-sm leading-6 text-white/68">We can package this guidance with the latest material data and a drawing review.</p>
                <Link href="/quote" className="mt-5 inline-flex min-h-10 items-center gap-2 border-b border-white/60 pb-1 text-sm font-semibold hover:border-white"><Download aria-hidden="true" className="h-4 w-4" /> Request technical pack <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
              </div>
            </aside>
          </div>
        </Section>

        <section className="border-t border-border bg-surface-low py-12 sm:py-16">
          <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c62828]">Continue exploring</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">More resources for your next design review</h2>
            </div>
            <Button href="/resources" variant="outline" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Back to resources</Button>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default TechnicalWhitepaperPage;
