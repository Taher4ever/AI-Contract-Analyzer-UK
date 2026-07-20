import type { Metadata } from "next";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with 3 documents a month. Upgrade to Pro for unlimited contract analysis, exports and priority processing.",
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
