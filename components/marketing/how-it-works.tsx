import { MessageSquare, Sparkles, Upload } from "lucide-react";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";

const steps = [
  {
    icon: Upload,
    title: "Upload your contract",
    body: "Drop in a PDF or DOCX — tenancy, employment, freelance, NDA or anything in between.",
  },
  {
    icon: Sparkles,
    title: "AI analyses every clause",
    body: "Get a risk score, a plain-English summary and the clauses that deserve your attention.",
  },
  {
    icon: MessageSquare,
    title: "Ask anything",
    body: "Chat with an AI that has read your document and cites the exact paragraphs it relies on.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 lg:py-28">
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            How it works
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            From upload to answers in three steps
          </h2>
        </FadeIn>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="via-border absolute top-12 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent to-transparent lg:block"
          />
          <FadeInStagger className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <FadeIn key={step.title}>
                <div className="glass shadow-soft relative h-full rounded-2xl p-7">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground shadow-soft flex size-10 items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="text-primary size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </Container>
    </section>
  );
}
