import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We collect only the business and technical information needed to respond to inquiries, prepare quotations, and support customer programs."
      sections={[
        { title: "Information we receive", body: "Inquiry forms may include contact details, company information, product requirements, drawings, specifications, and expected order volumes. We use this information only for evaluation, quotation, production planning, and customer support." },
        { title: "Technical files", body: "Customer drawings and specifications are treated as confidential project information. Access is limited to personnel involved in engineering, quality, commercial review, and approved production activities." },
        { title: "Retention and requests", body: "Records are retained for the period required to support quotations, repeat orders, quality traceability, and legal obligations. You may request correction or deletion of eligible personal information by contacting our sales team." },
      ]}
    />
  );
}
