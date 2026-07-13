import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FlaskConical,
  Mail,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Container,
  Footer,
  Header,
} from "@/components/site";
import { companyContact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers about Xingtai Oubei manufacturing, R&D, packaging, delivery, quality control, and rubber material capabilities.",
};

const faqGroups = [
  {
    id: "company-engineering",
    label: "Company & engineering",
    description: "How we are organized and how our technical team supports new requirements.",
    items: [
      {
        question: "Are you a trading company or a manufacturer?",
        answer:
          "We are a manufacturer. Our production, quality control, engineering support, and order preparation are coordinated through our own manufacturing operation in Xingtai, Hebei.",
      },
      {
        question: "Do you have your own R&D team?",
        answer:
          "Yes. We have a six-person professional design and development team. We can review drawings, recommend materials, and customize products around your application requirements.",
      },
      {
        question: "Why should we choose Xingtai Oubei?",
        answer:
          "Our company combines advanced production equipment, complete scientific testing instruments, strong technical capabilities, and large-scale production capacity for stable repeat supply.",
      },
    ],
  },
  {
    id: "orders-delivery",
    label: "Orders & delivery",
    description: "Practical information for packaging, stock orders, and production lead times.",
    items: [
      {
        question: "What packaging options do you offer?",
        answer:
          "We offer a range of standard packaging options and can also customize labels, bags, cartons, and packing formats according to your requirements.",
      },
      {
        question: "What is your typical delivery time?",
        answer:
          "Stock items can typically be dispatched within 3 days. Larger or custom production orders usually require about 10-20 days, depending on quantity, tooling, and the actual production schedule.",
      },
    ],
  },
  {
    id: "quality-materials",
    label: "Quality & materials",
    description: "Checks and compound families available for industrial sealing applications.",
    items: [
      {
        question: "How do you guarantee product quality?",
        answer:
          "We confirm a pre-production sample before mass production and perform final inspection before shipment. Material, dimensional, and visual checks are matched to the product and customer specification.",
      },
      {
        question: "Which materials can you produce?",
        answer:
          "Our material capabilities include NBR, FKM (Viton), EPDM, silicone, neoprene (CR), natural rubber (NR), IIR, SBR, ACM, AEM, fluorosilicone (FVMQ), FFKM, liquid silicone rubber, and related custom compounds.",
      },
    ],
  },
] as const;

const quickFacts = [
  { value: "Manufacturer", label: "Direct production support", icon: PackageCheck },
  { value: "6-person R&D", label: "Design and development team", icon: FlaskConical },
  { value: "Final inspection", label: "Before every shipment", icon: ShieldCheck },
] as const;

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-primary text-white">
          <Container className="max-w-[1280px] py-12 sm:py-16 lg:py-20">
            <Breadcrumbs dark items={[{ label: "FAQ" }]} className="mb-10" />
            <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
              <div className="max-w-3xl">
                <p className="font-mono text-[11px] font-semibold uppercase text-[#ff8d8d]">
                  Customer support / 01
                </p>
                <h1 className="mt-5 max-w-[13ch] text-4xl font-semibold leading-[1.03] text-white sm:text-5xl lg:text-6xl">
                  Frequently asked questions
                </h1>
                <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/72 sm:text-lg">
                  Clear answers about our manufacturing model, engineering support, packaging, delivery, quality controls, and material capabilities.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="#faq-list" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
                    Browse answers
                  </Button>
                  <Button
                    href="/quote"
                    variant="outline"
                    className="border-white/55 text-white hover:border-white hover:bg-white/10"
                  >
                    Ask a technical question
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-white/15 border-y border-white/15">
                {quickFacts.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div key={fact.value} className="grid grid-cols-[44px_1fr] items-center gap-4 py-5">
                      <span className="grid h-11 w-11 place-items-center border border-white/20 text-[#ff9a9a]">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">{fact.value}</p>
                        <p className="mt-1 text-xs text-white/58">{fact.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        <section id="faq-list" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-28">
          <Container className="max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <p className="font-mono text-[10px] font-semibold uppercase text-[#c62828]">Browse by topic</p>
                <nav aria-label="FAQ topics" className="mt-4 border-t border-border">
                  {faqGroups.map((group, index) => (
                    <a
                      key={group.id}
                      href={`#${group.id}`}
                      className="flex min-h-12 items-center justify-between gap-4 border-b border-border py-3 text-sm font-semibold text-primary transition-colors hover:text-[#c62828]"
                    >
                      <span>{group.label}</span>
                      <span className="font-mono text-[10px] text-muted">0{index + 1}</span>
                    </a>
                  ))}
                </nav>
                <div className="mt-8 border-l-2 border-[#c62828] pl-4">
                  <p className="text-sm font-semibold text-primary">Need an application-specific answer?</p>
                  <p className="mt-2 text-sm leading-6 text-muted">Share your media, pressure, temperature, dimensions, and target volume.</p>
                  <Link href="/quote" className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#c62828] underline decoration-border underline-offset-4">
                    Contact engineering <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </aside>

              <div className="min-w-0">
                {faqGroups.map((group, groupIndex) => (
                  <section
                    key={group.id}
                    id={group.id}
                    className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0"
                    aria-labelledby={`${group.id}-title`}
                  >
                    <div className="mb-6 grid gap-2 sm:grid-cols-[1fr_minmax(260px,0.75fr)] sm:items-end sm:gap-10">
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase text-[#c62828]">Topic 0{groupIndex + 1}</p>
                        <h2 id={`${group.id}-title`} className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">{group.label}</h2>
                      </div>
                      <p className="text-sm leading-6 text-muted">{group.description}</p>
                    </div>

                    <div className="border-t border-border">
                      {group.items.map((item, itemIndex) => {
                        const previousQuestions = faqGroups
                          .slice(0, groupIndex)
                          .reduce((total, previousGroup) => total + previousGroup.items.length, 0);
                        const number = previousQuestions + itemIndex + 1;
                        return (
                          <details key={item.question} className="group border-b border-border" open={number === 1}>
                            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-left text-primary transition-colors hover:text-[#c62828] [&::-webkit-details-marker]:hidden">
                              <span className="shrink-0 font-mono text-[11px] font-semibold text-muted">{String(number).padStart(2, "0")}</span>
                              <h3 className="min-w-0 flex-1 text-base font-semibold leading-6 sm:text-lg">{item.question}</h3>
                              <span className="grid h-11 w-11 shrink-0 place-items-center border border-border text-primary transition-[background-color,color,transform] duration-200 group-open:rotate-180 group-open:bg-primary group-open:text-white">
                                <ChevronDown aria-hidden="true" className="h-4 w-4" />
                              </span>
                            </summary>
                            <div className="pb-7 pl-9 pr-2 sm:pl-11 sm:pr-16">
                              <p className="max-w-[72ch] text-sm leading-7 text-muted sm:text-base">{item.answer}</p>
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-surface-low py-12 sm:py-16">
          <Container className="flex max-w-[1280px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase text-[#c62828]">Engineering support</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">Still need a technical answer?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Our team can review your drawing and operating conditions, then recommend a material and manufacturing path.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/quote" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Request a review</Button>
              <Button
                href={`mailto:${companyContact.email}`}
                variant="outline"
                icon={<Mail aria-hidden="true" className="h-4 w-4" />}
                iconPosition="left"
              >
                Email engineering
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
