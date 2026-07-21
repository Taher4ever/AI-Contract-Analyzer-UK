import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with 3 documents a month. Upgrade to Pro for unlimited contract analysis, exports and priority processing.",
};

export default async function PricingPage() {
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
      <Pricing currentPlan={currentPlan} />
      <Faq />
      <Cta />
    </>
  );
}
