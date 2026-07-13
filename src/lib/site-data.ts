/**
 * Shared content for the Xingtai Oubei marketing and product surfaces.
 *
 * Keeping the content in one typed module makes the route components mostly
 * presentational and gives the catalog, resources, and quote flows a common
 * vocabulary.
 */

export type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  code: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  alt: string;
  applications: string[];
  specs: string[];
  material: string;
};

export type Material = {
  slug: string;
  name: string;
  shortName: string;
  code: string;
  description: string;
  temperature: string;
  hardness: string;
  bestFor: string;
  image: string;
  alt: string;
  features: string[];
  accent: "ink" | "green" | "red" | "blue";
};

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  image: string;
  alt: string;
};

export type FooterColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export const navItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/materials" },
  { label: "OEM / ODM", href: "/custom" },
  { label: "About us", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "FAQ", href: "/faq", exact: true },
  { label: "Contact", href: "/quote" },
];

export const products: Product[] = [
  {
    slug: "o-rings",
    name: "Precision O-Rings",
    code: "OR-SERIES",
    category: "Static sealing",
    shortDescription: "Reliable axial and radial sealing for demanding equipment.",
    description:
      "Molded and precision-trimmed O-rings for hydraulic, pneumatic, automotive, and general industrial assemblies.",
    image: "/stitch/products-05.jpg",
    alt: "Precision rubber components in a production workshop",
    applications: ["Hydraulics", "Pneumatics", "Automotive", "General industry"],
    specs: ["AS568, ISO 3601, JIS B 2401", "2 to 500 mm ID", "40 to 90 Shore A"],
    material: "NBR, FKM, EPDM, VMQ",
  },
  {
    slug: "oil-seals",
    name: "Rotary Oil Seals",
    code: "OS-SERIES",
    category: "Rotary sealing",
    shortDescription: "Low-friction sealing for shafts, gearboxes, and drive systems.",
    description:
      "Engineered lip profiles and reinforcing options protect rotating equipment from oil ingress and contamination.",
    image: "/stitch/products-01.jpg",
    alt: "Organized oil seal inventory in a manufacturing warehouse",
    applications: ["Motors", "Gearboxes", "Pumps", "Agricultural machinery"],
    specs: ["DIN 3760 profiles", "Up to 40 m/s peripheral speed", "Custom dust lips"],
    material: "NBR, FKM, ACM, PTFE",
  },
  {
    slug: "hydraulic-seals",
    name: "Hydraulic Seals",
    code: "HS-SERIES",
    category: "Fluid power",
    shortDescription: "Stable sealing performance under high pressure and cycling.",
    description:
      "Rod, piston, wiper, and guide elements designed for cylinders and valves in mobile and industrial hydraulics.",
    image: "/stitch/products-06.jpg",
    alt: "Finished sealing products prepared for shipment",
    applications: ["Mobile hydraulics", "Injection molding", "Presses", "Valves"],
    specs: ["Up to 50 MPa working pressure", "-40 to 200°C service range", "Low compression set"],
    material: "PU, PTFE, NBR, FKM",
  },
  {
    slug: "custom-molded-parts",
    name: "Custom Molded Parts",
    code: "CM-SERIES",
    category: "Engineered components",
    shortDescription: "Application-specific geometry, compound, and finish.",
    description:
      "From prototype tooling to repeat production, our engineering team develops custom rubber and plastic components to drawing.",
    image: "/stitch/products-04.jpg",
    alt: "Rubber product testing equipment in the quality laboratory",
    applications: ["OEM assemblies", "Appliances", "Energy", "Industrial equipment"],
    specs: ["Tooling review within 48 hours", "Insert and multi-shot molding", "PPAP and FAI support"],
    material: "Custom compound selection",
  },
];

export const materials: Material[] = [
  {
    slug: "nbr",
    name: "Nitrile Butadiene Rubber",
    shortName: "NBR (Nitrile)",
    code: "NBR-701",
    description: "Balanced oil and fuel resistance for high-volume industrial sealing.",
    temperature: "-40 to +120°C",
    hardness: "40 to 90 Shore A",
    bestFor: "Hydraulic oils and general industry",
    image: "/stitch/home-02.jpg",
    alt: "Black rubber seals in a precision production line",
    features: ["Excellent oil resistance", "Low compression set grades", "Cost-effective for volume"],
    accent: "ink",
  },
  {
    slug: "fkm",
    name: "Fluorocarbon Rubber",
    shortName: "FKM (Viton)",
    code: "FKM-902",
    description: "High-temperature and chemical resistance for critical applications.",
    temperature: "-20 to +250°C",
    hardness: "60 to 90 Shore A",
    bestFor: "Chemical processing and fuel systems",
    image: "/stitch/home-03.jpg",
    alt: "Testing equipment used for high-performance rubber compounds",
    features: ["Wide chemical compatibility", "Low gas permeability", "High-temperature stability"],
    accent: "green",
  },
  {
    slug: "vmq",
    name: "Silicone Rubber",
    shortName: "VMQ (Silicone)",
    code: "VMQ-605",
    description: "Flexible, clean, and weather-stable for food and medical assemblies.",
    temperature: "-60 to +200°C",
    hardness: "30 to 80 Shore A",
    bestFor: "Medical, food, and outdoor equipment",
    image: "/stitch/home-04.jpg",
    alt: "Organized O-ring inventory for clean product handling",
    features: ["FDA and EU grade options", "Excellent ozone resistance", "Stable across temperatures"],
    accent: "red",
  },
  {
    slug: "epdm",
    name: "Ethylene Propylene Rubber",
    shortName: "EPDM",
    code: "EPDM-804",
    description: "Weather, ozone, and steam resistance for outdoor and water systems.",
    temperature: "-50 to +150°C",
    hardness: "40 to 90 Shore A",
    bestFor: "Water, steam, and weather sealing",
    image: "/stitch/products-02.jpg",
    alt: "Exterior view of the rubber manufacturing facility",
    features: ["Excellent weathering resistance", "Steam and hot-water compatible", "Long outdoor service life"],
    accent: "blue",
  },
];

export const insights: Insight[] = [
  {
    slug: "choosing-o-ring-hardness",
    category: "Technical guide",
    title: "How to choose the right O-ring hardness for high-pressure systems",
    excerpt: "A practical guide to Shore A, squeeze, and extrusion risk in critical sealing designs.",
    date: "2025-03-18",
    readingTime: "6 min read",
    image: "/stitch/home-08.jpg",
    alt: "Technician reviewing seal test results in the quality laboratory",
  },
  {
    slug: "sealing-renewable-energy",
    category: "Industry insight",
    title: "Specialized sealing for renewable energy infrastructure",
    excerpt: "Material choices that improve reliability across solar, wind, and battery environments.",
    date: "2025-02-06",
    readingTime: "4 min read",
    image: "/stitch/home-09.jpg",
    alt: "Industrial facility prepared for long-life component production",
  },
  {
    slug: "global-shipping-update",
    category: "Company update",
    title: "Expanded direct shipping routes to North America and the EU",
    excerpt: "New logistics partnerships shorten lead times while preserving batch-level traceability.",
    date: "2025-01-14",
    readingTime: "3 min read",
    image: "/stitch/home-10.jpg",
    alt: "Finished product warehouse with organized dispatch inventory",
  },
];

export const trustMarks = [
  { label: "20+ years experience", icon: "factory" },
  { label: "Global delivery", icon: "globe" },
  { label: "R&D lab tested", icon: "lab" },
  { label: "ISO 9001 certified", icon: "shield" },
] as const;

export const manufacturingStats = [
  { value: "5,000+", label: "Moulds in stock" },
  { value: "24/7", label: "Quality monitoring" },
  { value: "15+", label: "Patented materials" },
  { value: "99.8%", label: "Fulfilment rate" },
] as const;

export const materialComparison = materials.map((material) => ({
  code: material.code,
  material: material.name,
  maxTemperature: material.temperature.split(" to ")[1] ?? material.temperature,
  tensileStrength:
    material.slug === "nbr"
      ? "14.5 MPa"
      : material.slug === "fkm"
        ? "10.2 MPa"
        : material.slug === "vmq"
          ? "7.8 MPa"
          : "12.1 MPa",
  bestFor: material.bestFor,
}));

export const footerColumns: FooterColumn[] = [
  {
    title: "Catalog",
    links: [
      { label: "Products", href: "/products" },
      { label: "Materials", href: "/materials" },
      { label: "OEM / ODM", href: "/custom" },
      { label: "Request a quote", href: "/quote" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Technical guides", href: "/resources" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "Quality and certificates", href: "/about#quality" },
      { label: "Factory capabilities", href: "/about#facility" },
      { label: "Contact support", href: "/quote" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Xingtai Oubei", href: "/about" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export const companyContact = {
  name: "Xingtai Oubei Rubber Products Co., Ltd.",
  shortName: "Xingtai Oubei",
  address: "No. 888 Industrial Zone, Xingtai, Hebei, China",
  phone: "+86 319 000 0000",
  email: "sales@xingtaioubei.com",
  hours: "Mon-Fri, 08:30-17:30 (CST)",
};

// Friendly aliases used by route components and older catalog prototypes.
export const productData = products;
export const materialData = materials;
export const resourceData = insights;
export const resources = insights;
