import Link from "next/link";
import { ArrowRight, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";

// Placeholder home page — replaced by the full landing page in Phase 2.
export default function HomePage() {
  return (
    <Container className="py-24 lg:py-32">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          Built for UK contracts
        </Badge>
        <h1 className="font-display mt-6 text-5xl leading-tight tracking-tight text-balance sm:text-6xl">
          Understand any contract in{" "}
          <span className="text-primary italic">minutes</span>, not hours.
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty">
          Upload a contract and get a plain-English summary, a risk score,
          clause-by-clause analysis — and an AI you can ask anything.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="shadow-soft rounded-full"
            nativeButton={false}
            render={<Link href="/signup" />}
          >
            Analyze Contract
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            View pricing
          </Button>
        </div>
      </FadeIn>

      <FadeInStagger className="mt-24 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: FileText,
            title: "Plain-English summaries",
            body: "Every clause explained without the legalese.",
          },
          {
            icon: ShieldCheck,
            title: "Risk scores",
            body: "See what's risky before you sign anything.",
          },
          {
            icon: MessageSquare,
            title: "Ask the AI",
            body: "Chat with an AI that has read your document.",
          },
        ].map((feature) => (
          <FadeIn key={feature.title}>
            <Card className="glass shadow-soft h-full rounded-2xl border-none">
              <CardContent className="pt-2">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <feature.icon className="size-5" />
                </div>
                <h2 className="mt-4 font-semibold">{feature.title}</h2>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {feature.body}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </FadeInStagger>

      <p className="text-muted-foreground/80 mt-16 text-center text-xs">
        Not legal advice. ContractLens AI helps you understand documents — it
        does not replace a solicitor.
      </p>
    </Container>
  );
}
