'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Factory,
  FlaskConical,
  Globe2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import {
  companyContact,
  footerColumns,
  navItems,
  type NavItem,
} from "@/lib/site-data";

export type { FooterColumn, Insight, Material, Product } from "@/lib/site-data";
export {
  companyContact,
  footerColumns,
  insights,
  manufacturingStats,
  materialComparison,
  materials,
  navItems,
  products,
  resources,
  trustMarks,
} from "@/lib/site-data";

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#c62828] text-white shadow-sm hover:bg-[#a91f1f] focus-visible:ring-[#c62828]/40",
  secondary:
    "bg-primary text-on-primary shadow-sm hover:bg-primary-container focus-visible:ring-primary/40",
  outline:
    "border border-border bg-transparent text-primary hover:border-primary hover:bg-primary/5 focus-visible:ring-primary/30",
  ghost:
    "text-primary hover:bg-primary/8 focus-visible:ring-primary/30",
  link:
    "h-auto rounded-none border-b border-current px-0 pb-1 text-primary hover:text-[#c62828] focus-visible:ring-0",
  danger:
    "bg-[#c62828] text-white shadow-sm hover:bg-[#a91f1f] focus-visible:ring-[#c62828]/40",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

/** A link-or-button primitive with the square, compact geometry used by Stitch. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
  const content = (
    <>
      {icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as Omit<React.ComponentProps<typeof Link>, "href" | "className">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  bleed?: boolean;
};

export function Container({ className, bleed = false, ...props }: ContainerProps) {
  return (
    <div
      className={cx(
        "mx-auto w-full max-w-[1440px]",
        bleed ? "px-0" : "px-5 sm:px-8 lg:px-20",
        className,
      )}
      {...props}
    />
  );
}

type SectionTone = "default" | "muted" | "navy" | "white";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: SectionTone;
  contained?: boolean;
};

const sectionTones: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-surface-low text-foreground",
  navy: "bg-primary text-on-primary",
  white: "bg-white text-foreground",
};

export function Section({
  tone = "default",
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cx("py-16 sm:py-20 lg:py-28", sectionTones[tone], className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cx(
        "mb-10 flex gap-6",
        centered ? "flex-col items-center text-center" : "flex-col sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cx("max-w-2xl", centered && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#c62828]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold leading-tight text-primary sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className={cx("shrink-0", centered && "mx-auto")}>{action}</div> : null}
    </div>
  );
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  dark?: boolean;
};

export function Breadcrumbs({ items, className, dark = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cx("flex min-w-0 items-center gap-2 text-xs", dark ? "text-white/65" : "text-muted", className)}>
      <Link href="/" className={cx("shrink-0 transition-colors hover:text-[#c62828]", dark && "hover:text-white")}>
        Home
      </Link>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-50" />
            {item.href && !last ? (
              <Link href={item.href} className="truncate transition-colors hover:text-[#c62828]">
                {item.label}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className="truncate font-medium">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

type HeaderProps = {
  items?: NavItem[];
  activePath?: string;
  className?: string;
  compact?: boolean;
};

export function Header({ items = navItems, activePath, className, compact = false }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentPath = activePath ?? pathname;

  const isActive = (item: NavItem) => {
    if (item.exact || item.href === "/") return currentPath === item.href;
    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  };

  return (
    <header className={cx("sticky top-0 z-50 border-b border-white/15 bg-primary text-on-primary shadow-sm", className)}>
      <Container className={cx("flex items-center justify-between gap-4", compact ? "py-3" : "py-4")}>
        <Link href="/" className="group flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.webp"
            alt="Xingtai Oubei"
            width={302}
            height={90}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-4 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "border-b-2 border-transparent py-2 text-sm transition-colors",
                isActive(item) ? "border-white text-white" : "text-white/70 hover:border-white/50 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <label className="relative block" aria-label="Search components">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              type="search"
              placeholder="Search components..."
              className="h-10 w-48 rounded-sm border border-white/15 bg-primary-container/50 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/70 focus:ring-2 focus:ring-white/20"
            />
          </label>
          <Button href="/quote" size="sm" variant="danger" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
            Inquiry now
          </Button>
          <button type="button" title="Change language" aria-label="Change language" className="rounded-sm p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <Globe2 aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="rounded-sm p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-primary-container lg:hidden">
          <Container className="space-y-1 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  "flex items-center justify-between rounded-sm px-3 py-3 text-sm",
                  isActive(item) ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
            <div className="flex gap-3 border-t border-white/10 pt-4">
              <Button href="/quote" size="sm" variant="danger" className="flex-1" icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>
                Inquiry now
              </Button>
              <button type="button" title="Change language" aria-label="Change language" className="rounded-sm border border-white/15 px-3 text-white/80 hover:bg-white/10">
                <Globe2 aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

export const SiteHeader = Header;

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cx("border-t border-border bg-surface-highest", className)}>
      <Container className="py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_repeat(3,1fr)] lg:gap-12">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center text-primary">
              <Image
                src="/logo.webp"
                alt="Xingtai Oubei"
                width={302}
                height={90}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-sm leading-6 text-muted">
              Precision rubber and plastic sealing components for global industrial supply chains. ISO 9001:2015 quality systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="inline-flex items-center gap-1.5 border border-border px-2 py-1"><BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" /> ISO 9001</span>
              <span className="inline-flex items-center gap-1.5 border border-border px-2 py-1"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Traceable lots</span>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted transition-colors hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
          <div className="text-sm text-muted">
            <p className="font-semibold text-primary">Contact engineering sales</p>
            <p className="mt-1">Send drawings, compound requirements, or target volumes for a fast recommendation.</p>
          </div>
          <a href={`mailto:${companyContact.email}`} className="flex items-start gap-3 text-sm text-muted transition-colors hover:text-primary">
            <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{companyContact.email}</span>
          </a>
          <div className="space-y-2 text-sm text-muted">
            <a href={`tel:${companyContact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 transition-colors hover:text-primary">
              <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
              <span>{companyContact.phone}</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{companyContact.address}</span>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-border bg-surface-highest/70">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {companyContact.name} All rights reserved.</span>
          <span className="font-mono uppercase tracking-[0.12em]">Built for reliable sealing</span>
        </Container>
      </div>
    </footer>
  );
}

export const SiteFooter = Footer;

/** Small trust-mark icon helper for homepage bands and capability lists. */
export function TrustIcon({ type }: { type: string }) {
  const props = { "aria-hidden": true, className: "h-5 w-5" } as const;
  if (type === "globe") return <Globe2 {...props} />;
  if (type === "lab") return <FlaskConical {...props} />;
  if (type === "shield") return <ShieldCheck {...props} />;
  if (type === "delivery") return <Truck {...props} />;
  if (type === "resources") return <BookOpen {...props} />;
  return <Factory {...props} />;
}

export function ExternalLinkIcon() {
  return <ArrowUpRight aria-hidden="true" className="h-4 w-4" />;
}

export function ExpandableLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
      {children}
      <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
    </span>
  );
}
