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

export type MediaSlotDefault = {
  slotKey: string;
  pageKey: string;
  label: string;
  defaultPath: string;
  alt: string;
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

export const homepageMaterials: Material[] = [
  materials[1],
  materials[0],
  materials[2],
  materials[3],
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

export const defaultMediaSlots: MediaSlotDefault[] = [
  { slotKey: "home.hero.left", pageKey: "home", label: "Hero left product", defaultPath: "/hero-products/1.png", alt: "Green rubber sealing ring" },
  { slotKey: "home.hero.right", pageKey: "home", label: "Hero right product", defaultPath: "/hero-products/2.png", alt: "Brown rotary sealing ring" },
  { slotKey: "home.factory.workshop", pageKey: "home", label: "Factory workshop", defaultPath: "/factory/车间1.jpg", alt: "Oubei rubber molding workshop" },
  { slotKey: "home.factory.lab", pageKey: "home", label: "Factory laboratory", defaultPath: "/factory/实验室.jpg", alt: "Material testing laboratory" },
  { slotKey: "home.factory.warehouse", pageKey: "home", label: "Factory warehouse", defaultPath: "/factory/成品仓.jpg", alt: "Finished goods warehouse" },
  { slotKey: "home.insight.hardness", pageKey: "home", label: "Insight: O-ring hardness", defaultPath: "/stitch/home-08.jpg", alt: "Technician reviewing seal test results in the quality laboratory" },
  { slotKey: "home.insight.renewable", pageKey: "home", label: "Insight: renewable energy", defaultPath: "/stitch/home-09.jpg", alt: "Industrial facility prepared for long-life component production" },
  { slotKey: "home.insight.shipping", pageKey: "home", label: "Insight: shipping update", defaultPath: "/stitch/home-10.jpg", alt: "Finished product warehouse with organized dispatch inventory" },
  { slotKey: "products.o-rings", pageKey: "products", label: "O-rings product image", defaultPath: "/stitch/products-05.jpg", alt: "Precision rubber components in a production workshop" },
  { slotKey: "products.oil-seals", pageKey: "products", label: "Oil seals product image", defaultPath: "/stitch/products-01.jpg", alt: "Organized oil seal inventory in a manufacturing warehouse" },
  { slotKey: "products.hydraulic-seals", pageKey: "products", label: "Hydraulic seals product image", defaultPath: "/stitch/products-06.jpg", alt: "Finished sealing products prepared for shipment" },
  { slotKey: "products.custom-molded-parts", pageKey: "products", label: "Custom molded parts image", defaultPath: "/stitch/products-04.jpg", alt: "Rubber product testing equipment in the quality laboratory" },
  { slotKey: "products.detail.fkm.1", pageKey: "products-detail", label: "FKM detail image 1", defaultPath: "/stitch/product-detail-06.jpg", alt: "FKM rubber seal detail" },
  { slotKey: "products.detail.fkm.2", pageKey: "products-detail", label: "FKM detail image 2", defaultPath: "/stitch/product-detail-07.jpg", alt: "FKM rubber seal profile" },
  { slotKey: "products.detail.fkm.3", pageKey: "products-detail", label: "FKM detail image 3", defaultPath: "/stitch/product-detail-08.jpg", alt: "FKM rubber seal application" },
  { slotKey: "products.detail.fkm.4", pageKey: "products-detail", label: "FKM detail image 4", defaultPath: "/stitch/product-detail-09.jpg", alt: "FKM rubber seal surface" },
  { slotKey: "materials.fkm", pageKey: "materials", label: "FKM material image", defaultPath: "/stitch/products-05.jpg", alt: "FKM material sample" },
  { slotKey: "materials.nbr", pageKey: "materials", label: "NBR material image", defaultPath: "/stitch/product-detail-01.jpg", alt: "NBR material sample" },
  { slotKey: "materials.vmq", pageKey: "materials", label: "VMQ material image", defaultPath: "/stitch/product-detail-06.jpg", alt: "VMQ material sample" },
  { slotKey: "materials.epdm", pageKey: "materials", label: "EPDM material image", defaultPath: "/stitch/product-detail-09.jpg", alt: "EPDM material sample" },
  { slotKey: "about.gate", pageKey: "about", label: "Facility entrance", defaultPath: "/factory/新公司大门图片.png", alt: "Oubei manufacturing facility entrance" },
  { slotKey: "about.quality.1", pageKey: "about", label: "Quality badge 1", defaultPath: "/stitch/about-02.jpg", alt: "ISO 9001 quality system" },
  { slotKey: "about.quality.2", pageKey: "about", label: "Quality badge 2", defaultPath: "/stitch/about-03.jpg", alt: "SGS quality verification" },
  { slotKey: "about.quality.3", pageKey: "about", label: "Quality badge 3", defaultPath: "/stitch/about-04.jpg", alt: "RoHS compliance" },
  { slotKey: "about.quality.4", pageKey: "about", label: "Quality badge 4", defaultPath: "/stitch/about-05.jpg", alt: "Automotive quality controls" },
  { slotKey: "about.quality.5", pageKey: "about", label: "Quality badge 5", defaultPath: "/stitch/about-06.jpg", alt: "International audit readiness" },
  { slotKey: "about.certificate.1", pageKey: "about", label: "Certificate 1", defaultPath: "/certificates/1.png", alt: "Oubei certificate 1" },
  { slotKey: "about.certificate.2", pageKey: "about", label: "Certificate 2", defaultPath: "/certificates/2.png", alt: "Oubei certificate 2" },
  { slotKey: "about.certificate.3", pageKey: "about", label: "Certificate 3", defaultPath: "/certificates/3.png", alt: "Oubei certificate 3" },
  { slotKey: "about.history.factory", pageKey: "about", label: "History factory image", defaultPath: "/stitch/about-08.jpg", alt: "Oubei factory history" },
  { slotKey: "about.history.warehouse", pageKey: "about", label: "History warehouse image", defaultPath: "/stitch/about-09.jpg", alt: "Organized export warehouse" },
  { slotKey: "about.history.team", pageKey: "about", label: "History team image", defaultPath: "/stitch/about-10.jpg", alt: "Oubei team at work" },
  { slotKey: "about.capability", pageKey: "about", label: "Capability image", defaultPath: "/stitch/about-07.jpg", alt: "Oubei manufacturing capability" },
  { slotKey: "about.team.1", pageKey: "about", label: "Team member 1", defaultPath: "/stitch/about-14.jpg", alt: "Oubei engineering team member" },
  { slotKey: "about.team.2", pageKey: "about", label: "Team member 2", defaultPath: "/stitch/about-15.jpg", alt: "Oubei engineering team member" },
  { slotKey: "about.team.3", pageKey: "about", label: "Team member 3", defaultPath: "/stitch/about-16.jpg", alt: "Oubei engineering team member" },
  { slotKey: "about.team.4", pageKey: "about", label: "Team member 4", defaultPath: "/stitch/about-17.jpg", alt: "Senior materials engineer" },
  { slotKey: "custom.hero", pageKey: "custom", label: "Custom solutions hero", defaultPath: "/stitch/custom-01.jpg", alt: "Custom rubber molding solution" },
  { slotKey: "custom.study.1", pageKey: "custom", label: "Custom case study 1", defaultPath: "/stitch/custom-02.jpg", alt: "Custom molding case study" },
  { slotKey: "custom.study.2", pageKey: "custom", label: "Custom case study 2", defaultPath: "/stitch/custom-03.jpg", alt: "Custom sealing case study" },
  { slotKey: "resources.hero", pageKey: "resources", label: "Resources hero", defaultPath: "/stitch/resources-01.jpg", alt: "Oubei technical resources" },
  { slotKey: "resources.2", pageKey: "resources", label: "Resource image 2", defaultPath: "/stitch/resources-02.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.3", pageKey: "resources", label: "Resource image 3", defaultPath: "/stitch/resources-03.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.4", pageKey: "resources", label: "Resource image 4", defaultPath: "/stitch/resources-04.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.5", pageKey: "resources", label: "Resource image 5", defaultPath: "/stitch/resources-05.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.6", pageKey: "resources", label: "Resource image 6", defaultPath: "/stitch/resources-06.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.7", pageKey: "resources", label: "Resource image 7", defaultPath: "/stitch/resources-07.jpg", alt: "Oubei resource illustration" },
  { slotKey: "resources.article.hero", pageKey: "resources-detail", label: "Technical article image", defaultPath: "/stitch/article-01.jpg", alt: "O-rings in several compounds on a laboratory workbench" },
];

// Friendly aliases used by route components and older catalog prototypes.
export const productData = products;
export const materialData = materials;
export const resourceData = insights;
export const resources = insights;
