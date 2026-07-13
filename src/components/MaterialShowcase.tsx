"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { Button, SectionHeading, cx } from "@/components/site";
import type { Material } from "@/lib/site-data";

type MaterialShowcaseProps = {
  materials: Material[];
};

export default function MaterialShowcase({ materials }: MaterialShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const lastIndexRef = useRef<number | null>(0);

  function selectMaterial(index: number, scroll = false) {
    lastIndexRef.current = index;
    setActiveIndex(index);
    if (scroll) {
      window.requestAnimationFrame(() => {
        itemRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
    }
  }

  function moveSelection(direction: -1 | 1) {
    const current = activeIndex ?? lastIndexRef.current;
    const next = current === null
      ? (direction === 1 ? 0 : materials.length - 1)
      : (current + direction + materials.length) % materials.length;
    selectMaterial(next, true);
  }

  function closeOnMouseLeave(event: MouseEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(document.activeElement)) setActiveIndex(null);
  }

  function closeOnBlur(index: number, event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveIndex((current) => (current === index ? null : current));
    }
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Material engineering"
        title="Technical Material Categories"
        description="Optimized compounds engineered for extreme temperatures, pressure, and chemical resistance."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button href="/materials" variant="link" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
              View all materials
            </Button>
            <div className="ml-1 hidden items-center gap-2 md:flex" role="group" aria-label="Material slider controls">
              <button
                type="button"
                title="Previous material"
                aria-label="Previous material"
                onClick={() => moveSelection(-1)}
                className="grid h-11 w-11 place-items-center border border-border bg-white text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Next material"
                aria-label="Next material"
                onClick={() => moveSelection(1)}
                className="grid h-11 w-11 place-items-center border border-border bg-white text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        }
      />

      <div className="relative -mx-5 sm:-mx-8 md:mx-0">
        <div
          className="flex h-[480px] snap-x snap-mandatory gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:h-[510px] md:gap-3 md:overflow-visible"
          onMouseLeave={closeOnMouseLeave}
        >
          {materials.map((material, index) => {
            const active = activeIndex === index;
            const panelId = `material-panel-${material.slug}`;

            return (
              <article
                key={material.slug}
                ref={(node) => { itemRefs.current[index] = node; }}
                onMouseEnter={() => selectMaterial(index)}
                onFocusCapture={() => selectMaterial(index)}
                onBlurCapture={(event) => closeOnBlur(index, event)}
                className={cx(
                  "group relative h-full w-full max-w-none shrink-0 snap-center overflow-hidden border bg-primary md:w-auto md:min-w-0 md:shrink md:transition-[flex] md:duration-[380ms] md:ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active ? "border-primary md:flex-[2.15]" : "border-border md:flex-1",
                )}
              >
                <Image
                  src={material.image}
                  alt={material.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className={cx(
                    "object-cover transition-transform duration-[380ms] ease-out",
                    material.slug === "fkm" && "origin-bottom scale-[1.12]",
                    active && "scale-[1.05]",
                    active && material.slug === "fkm" && "scale-[1.16]",
                  )}
                />

                <div
                  aria-hidden="true"
                  className={cx(
                    "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,30,64,0.04)_10%,rgba(0,30,64,0.34)_45%,rgba(0,30,64,0.98)_100%)] transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />

                <button
                  type="button"
                  aria-label={`Show ${material.shortName} details`}
                  aria-controls={panelId}
                  aria-expanded={active}
                  tabIndex={active ? -1 : 0}
                  onClick={() => selectMaterial(index, true)}
                  className={cx(
                    "absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/80",
                    active && "pointer-events-none",
                  )}
                />

                <div
                  id={panelId}
                  aria-hidden={!active}
                  className={cx(
                    "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex min-h-[76%] flex-col justify-end p-6 text-white transition-[opacity,transform] duration-300 ease-out sm:p-8",
                    active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                  )}
                >
                  <div className="max-w-[440px]">
                    <p className="font-mono text-[11px] font-medium uppercase text-white/70">{material.code}</p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">{material.shortName}</h2>
                    <p className="mt-4 max-w-[42ch] text-sm leading-6 text-white/78 sm:text-base">{material.description}</p>
                    <dl className="mt-6 grid gap-2 font-mono text-[11px] sm:grid-cols-2 sm:gap-3">
                      <div className="border-t border-white/30 pt-3">
                        <dt className="text-white/60">Temperature</dt>
                        <dd className="mt-1 font-semibold text-white">{material.temperature}</dd>
                      </div>
                      <div className="border-t border-white/30 pt-3">
                        <dt className="text-white/60">Hardness</dt>
                        <dd className="mt-1 font-semibold text-white">{material.hardness}</dd>
                      </div>
                    </dl>
                    <Link
                      href="/quote"
                      tabIndex={active ? 0 : -1}
                      className="pointer-events-auto mt-7 inline-flex min-h-11 items-center gap-2 border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-white hover:text-white/80"
                    >
                      Inquire now <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 md:hidden" role="group" aria-label="Material slider controls">
          <button
            type="button"
            title="Previous material"
            aria-label="Previous material"
            onClick={() => moveSelection(-1)}
            className="pointer-events-auto absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/70 bg-white/90 text-primary shadow-lg transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            title="Next material"
            aria-label="Next material"
            onClick={() => moveSelection(1)}
            className="pointer-events-auto absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/70 bg-white/90 text-primary shadow-lg transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
