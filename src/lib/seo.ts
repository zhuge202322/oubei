import type { Metadata } from "next";

export const SITE_ORIGIN = "https://www.htob-ffkm.com";
export const SITE_NAME = "Xingtai Oubei";
export const DEFAULT_SOCIAL_IMAGE = "/factory/新公司大门图片.png";

export type PageSeoInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export type ProductSeoInput = {
  slug: string;
  name: string;
  code: string;
  shortDescription: string;
  description: string;
  material: string;
  image: string;
};

export type ResourceSeoInput = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt?: string;
};

export const PUBLIC_PAGE_SEO: Record<string, PageSeoInput> = {
  home: {
    path: "/",
    title: "Industrial Rubber Seals & O-Rings Manufacturer | Oubei",
    description: "Xingtai Oubei manufactures precision O-rings, oil seals and custom molded rubber components with material engineering and global OEM support.",
    image: "/factory/新公司大门图片.png",
    imageAlt: "Xingtai Oubei rubber manufacturing facility",
  },
  about: {
    path: "/about",
    title: "About Xingtai Oubei Industrial Rubber Manufacturing",
    description: "Learn about Xingtai Oubei's rubber manufacturing facility, quality systems, engineering team and global supply capabilities for industrial seals.",
    image: "/factory/新公司大门图片.png",
    imageAlt: "Xingtai Oubei manufacturing facility entrance",
  },
  products: {
    path: "/products",
    title: "Industrial Rubber Seals & O-Rings Catalog | Oubei Co",
    description: "Browse O-rings, oil seals, hydraulic seals and custom molded rubber products engineered by Xingtai Oubei for demanding industrial applications.",
    image: "/stitch/products-05.jpg",
    imageAlt: "Precision rubber sealing products",
  },
  materials: {
    path: "/materials",
    title: "Rubber Sealing Materials: FKM, NBR, EPDM & Silicone",
    description: "Compare FKM, NBR, EPDM and silicone rubber materials by temperature, hardness and chemical resistance for reliable industrial sealing.",
    image: "/stitch/home-03.jpg",
    imageAlt: "High-performance rubber material sample",
  },
  custom: {
    path: "/custom",
    title: "Custom Rubber Molding & OEM Seal Manufacturing Services",
    description: "Develop custom molded rubber parts and OEM sealing solutions with material selection, tooling support, quality control and scalable production.",
    image: "/stitch/custom-01.jpg",
    imageAlt: "Custom rubber molding engineering service",
  },
  resources: {
    path: "/resources",
    title: "Rubber Seal Engineering Guides & Industry Resources",
    description: "Read practical guides on O-ring selection, sealing materials, industrial applications and global sourcing from Xingtai Oubei engineers.",
    image: "/stitch/resources-01.jpg",
    imageAlt: "Technical rubber sealing resources",
  },
  faq: {
    path: "/faq",
    title: "Rubber Seal Manufacturing & Ordering FAQ | Xingtai Oubei",
    description: "Find answers about custom rubber seals, materials, tooling, samples, minimum orders, quality control, lead times and international shipping.",
    image: "/stitch/resources-02.jpg",
    imageAlt: "Rubber seal manufacturing questions",
  },
  quote: {
    path: "/quote",
    title: "Request a Custom Rubber Seal Quote | Xingtai Oubei",
    description: "Send drawings and operating requirements to Xingtai Oubei for a custom rubber seal quotation, material recommendation and engineering review.",
    image: "/stitch/custom-02.jpg",
    imageAlt: "Custom rubber seal quote engineering review",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy for Xingtai Oubei Website Customers",
    description: "Read how Xingtai Oubei collects, uses, protects and retains business contact details, technical drawings and quotation request information.",
    image: DEFAULT_SOCIAL_IMAGE,
    imageAlt: "Xingtai Oubei facility",
  },
  terms: {
    path: "/terms",
    title: "Website Terms for Xingtai Oubei Rubber Products Co.",
    description: "Review the terms governing technical information, quotations, orders, intellectual property and use of the Xingtai Oubei website.",
    image: DEFAULT_SOCIAL_IMAGE,
    imageAlt: "Xingtai Oubei rubber products facility",
  },
  fkm: {
    path: "/products/fkm-rubber-o-ring",
    title: "FKM Rubber O-Rings for Chemical & High-Temperature Use",
    description: "Explore FKM rubber O-rings for high-temperature, fuel and chemical sealing, with compound options and custom dimensions from Xingtai Oubei.",
    image: "/stitch/product-detail-06.jpg",
    imageAlt: "FKM rubber O-ring detail",
  },
  hardness: {
    path: "/resources/choosing-o-ring-hardness",
    title: "How to Choose O-Ring Hardness for High-Pressure Seals",
    description: "Learn how Shore A hardness, squeeze, clearance and pressure affect O-ring extrusion risk and sealing reliability in hydraulic systems.",
    image: "/stitch/home-08.jpg",
    imageAlt: "Technician reviewing O-ring test results",
  },
  whitepaper: {
    path: "/resources/technical-whitepapers/high-temperature-o-ring-material",
    title: "High-Temperature O-Ring Materials Technical Whitepaper",
    description: "Compare FKM, FFKM, silicone and other high-temperature O-ring materials for chemical compatibility, service life and industrial performance.",
    image: "/stitch/article-01.jpg",
    imageAlt: "High-temperature O-ring materials on a workbench",
  },
  renewable: {
    path: "/resources/sealing-renewable-energy",
    title: "Rubber Sealing Solutions for Renewable Energy Equipment",
    description: "Explore material and seal design considerations for solar, wind and battery equipment exposed to heat, weather, fluids and long service cycles.",
    image: "/stitch/home-09.jpg",
    imageAlt: "Renewable energy equipment sealing application",
  },
  shipping: {
    path: "/resources/global-shipping-update",
    title: "Industrial Rubber Seal Shipping to North America & EU",
    description: "Learn how Xingtai Oubei's expanded logistics routes improve rubber seal delivery times, export documentation and batch-level traceability.",
    image: "/stitch/home-10.jpg",
    imageAlt: "Export-ready rubber seal warehouse",
  },
};

export function toAbsoluteUrl(path: string) {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

function assertSeoRange(title: string, description: string) {
  if (title.length < 50 || title.length > 60) throw new Error(`SEO title must be 50-60 characters: ${title}`);
  if (description.length < 120 || description.length > 155) throw new Error(`SEO description must be 120-155 characters: ${description}`);
}

function fitTitle(seed: string) {
  let title = seed.trim();
  if (title.length < 50) title = `${title} for Industrial Applications | Oubei`;
  if (title.length < 50) title = `${title} Rubber`;
  if (title.length > 60) title = `${title.slice(0, 57).trimEnd()}...`;
  return title;
}

function fitDescription(seed: string) {
  let description = seed.trim();
  const suffix = " Contact Oubei for custom dimensions, materials and OEM support.";
  while (description.length < 120) description += suffix;
  return description.length > 155 ? `${description.slice(0, 152).trimEnd()}...` : description;
}

export function createPageMetadata(input: PageSeoInput): Metadata {
  const title = input.title.trim();
  const description = input.description.trim();
  assertSeoRange(title, description);
  const url = toAbsoluteUrl(input.path);
  const image = toAbsoluteUrl(input.image || DEFAULT_SOCIAL_IMAGE);
  const imageAlt = input.imageAlt || title;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function createProductMetadata(product: ProductSeoInput): Metadata {
  return createPageMetadata({
    path: `/products/${product.slug}`,
    title: fitTitle(`${product.name} ${product.code} Rubber Seal Manufacturer | Oubei`),
    description: fitDescription(`${product.name} (${product.code}) from Xingtai Oubei: ${product.shortDescription} Material: ${product.material}.`),
    image: product.image,
    imageAlt: product.name,
  });
}

export function createResourceMetadata(resource: ResourceSeoInput): Metadata {
  const configured = PUBLIC_PAGE_SEO[resource.slug === "choosing-o-ring-hardness" ? "hardness" : resource.slug === "technical-whitepapers/high-temperature-o-ring-material" ? "whitepaper" : resource.slug === "sealing-renewable-energy" ? "renewable" : resource.slug === "global-shipping-update" ? "shipping" : ""];
  return createPageMetadata(configured || {
    path: `/resources/${resource.slug}`,
    title: fitTitle(`${resource.title} | Xingtai Oubei`),
    description: fitDescription(`${resource.excerpt} Read engineering guidance from Xingtai Oubei for reliable rubber sealing decisions.`),
    image: resource.image,
    imageAlt: resource.alt || resource.title,
  });
}
