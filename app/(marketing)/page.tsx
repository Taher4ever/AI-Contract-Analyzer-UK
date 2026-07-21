import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";
import { faqs } from "@/components/marketing/data";
import { JsonLd } from "@/components/shared/json-ld";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/stripe/plans";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ContractLens AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: appUrl,
  description:
    "AI-powered analysis of UK contracts: risk scores, plain-English summaries and clause-by-clause breakdowns.",
  offers: PLANS.map((tier) => ({
    "@type": "Offer",
    name: tier.name,
    price: tier.monthlyPrice.toString(),
    priceCurrency: "GBP",
    description: tier.description,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentPlan = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    currentPlan = profile?.plan ?? "free";
  }

  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Pricing currentPlan={currentPlan} />
      <Faq />
      <Cta />
    </>
  );
}
