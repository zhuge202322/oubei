import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, Button, Container, Footer, Header } from "@/components/site";
import { insights } from "@/lib/site-data";

const genericInsights = insights.filter((insight) => insight.slug !== "choosing-o-ring-hardness");

export function generateStaticParams() {
  return genericInsights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insight = genericInsights.find((item) => item.slug === slug);
  return insight ? { title: insight.title, description: insight.excerpt } : {};
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = genericInsights.find((item) => item.slug === slug);
  if (!insight) notFound();

  return (
    <>
      <Header activePath="/resources" />
      <main>
        <article>
          <header className="border-b border-border bg-white py-12 sm:py-16">
            <Container className="max-w-5xl">
              <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: insight.category }]} />
              <p className="mt-10 font-mono text-xs uppercase text-accent">{insight.category}</p>
              <h1 className="mt-4 max-w-[24ch] text-4xl font-bold leading-tight text-primary sm:text-5xl">{insight.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{insight.excerpt}</p>
              <p className="mt-6 font-mono text-xs text-muted">{insight.date} · {insight.readingTime}</p>
            </Container>
          </header>
          <Container className="max-w-5xl py-12 sm:py-16">
            <div className="relative aspect-[16/8] overflow-hidden bg-surface-low">
              <Image src={insight.image} alt={insight.alt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
            </div>
            <div className="prose-copy mx-auto mt-12 max-w-3xl space-y-10">
              <section>
                <h2>Engineering context</h2>
                <p className="mt-4">Reliable sealing begins with the full operating envelope: media, pressure, temperature, movement, surface finish, and the expected maintenance interval. A compound that performs well in one condition can fail quickly when these variables interact.</p>
              </section>
              <section>
                <h2>What to validate</h2>
                <p className="mt-4">Confirm compatibility with the actual fluid, review compression set at sustained temperature, and verify dimensional tolerances on the installed hardware. Production validation should use representative parts and agreed inspection criteria.</p>
              </section>
              <section className="border-l-4 border-accent bg-surface-low p-6 sm:p-8">
                <h2>Discuss the application</h2>
                <p className="mt-4">Share a drawing and operating conditions with our engineering team for a material and manufacturing review.</p>
                <Button href="/quote" className="mt-6" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Request a technical review</Button>
              </section>
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
