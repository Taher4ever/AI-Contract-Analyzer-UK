import {
  CalendarClock,
  FileDown,
  FileText,
  Gauge,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";

const features = [
  {
    icon: Gauge,
    title: "Risk Score",
    body: "A single 0–100 score that tells you instantly how carefully to read before you sign.",
  },
  {
    icon: FileText,
    title: "Plain-English Summary",
    body: "Every section translated from legalese into language you'd actually use.",
  },
  {
    icon: ShieldAlert,
    title: "Hidden Risks",
    body: "Unfair terms, missing protections and traps highlighted with the exact clause cited.",
  },
  {
    icon: CalendarClock,
    title: "Key Dates Timeline",
    body: "Notice periods, break clauses and renewals laid out on a timeline you can't miss.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    body: "Ask “Can I leave early?” and get an answer grounded in your document, with sources.",
  },
  {
    icon: FileDown,
    title: "Export Reports",
    body: "Share a polished PDF report or a secure link with your partner, agent or team.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 lg:py-28">
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Features
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Everything you need to sign with confidence
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            One upload gets you the full picture — no legal dictionary
            required.
          </p>
        </FadeIn>

        <FadeInStagger
          faster
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FadeIn key={feature.title}>
              <div className="glass shadow-soft hover:shadow-soft-lg h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {feature.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </section>
  );
}
