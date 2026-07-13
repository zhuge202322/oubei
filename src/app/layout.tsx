import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Xingtai Oubei | Precision Rubber Sealing Solutions",
    template: "%s | Xingtai Oubei",
  },
  description:
    "ISO-certified manufacturer of precision O-rings, oil seals, custom molded rubber parts, and OEM/ODM sealing solutions.",
  keywords: ["O-rings", "oil seals", "rubber seals", "FKM", "NBR", "OEM rubber molding"],
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
