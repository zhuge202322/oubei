import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Website information supports preliminary product evaluation. Final commercial and technical requirements are defined in the applicable quotation and order documents."
      sections={[
        { title: "Technical information", body: "Published material ranges, dimensions, and performance values are general guidance. Suitability depends on media, pressure, temperature, motion, tolerances, and validation under the customer's actual operating conditions." },
        { title: "Quotations and orders", body: "Pricing, tooling, lead time, inspection scope, packaging, and delivery terms become binding only when stated in an accepted quotation, purchase order, or signed agreement." },
        { title: "Intellectual property", body: "Customer-owned drawings and marks remain the customer's property. Xingtai Oubei retains ownership of its standard product designs, manufacturing knowledge, site content, and other materials unless a written agreement states otherwise." },
      ]}
    />
  );
}
