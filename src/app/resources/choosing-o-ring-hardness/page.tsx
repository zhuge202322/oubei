import type { Metadata } from "next";
import { TechnicalWhitepaperPage } from "../technical-whitepapers/high-temperature-o-ring-material/page";

export const metadata: Metadata = {
  title: "Choosing O-ring hardness",
  description:
    "A practical guide to Shore A hardness, squeeze, extrusion gaps, and backup rings for high-pressure O-ring designs.",
};

export default function ChoosingORingHardnessPage() {
  return <TechnicalWhitepaperPage variant="hardness" />;
}
