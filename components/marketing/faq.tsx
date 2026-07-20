import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { faqs } from "@/components/marketing/data";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="max-w-3xl">
        <FadeIn className="text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Questions, answered
          </h2>
        </FadeIn>

        <FadeIn className="glass shadow-soft mt-12 rounded-2xl px-6 py-2">
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="py-4 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </Container>
    </section>
  );
}
