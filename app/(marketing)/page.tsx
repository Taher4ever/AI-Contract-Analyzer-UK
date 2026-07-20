import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
