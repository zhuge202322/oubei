import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Industrial Rubber Sealing Solutions Manufacturer | Oubei",
    template: "%s | Xingtai Oubei",
  },
  description:
    "ISO-certified manufacturer of precision O-rings, oil seals, custom molded rubber parts, and OEM/ODM sealing solutions for global industry.",
  keywords: ["O-rings", "oil seals", "rubber seals", "FKM", "NBR", "OEM rubber molding"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Industrial Rubber Sealing Solutions Manufacturer | Oubei",
    description: "ISO-certified manufacturer of precision O-rings, oil seals, custom molded rubber parts, and OEM/ODM sealing solutions for global industry.",
    url: SITE_ORIGIN,
    images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: "Xingtai Oubei rubber manufacturing facility" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Rubber Sealing Solutions Manufacturer | Oubei",
    description: "ISO-certified manufacturer of precision O-rings, oil seals, custom molded rubber parts, and OEM/ODM sealing solutions for global industry.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
