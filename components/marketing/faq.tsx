import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";

const faqs = [
  {
    question: "Is this legal advice?",
    answer:
      "No. ContractLens AI explains what your contract says in plain English, but it is not a law firm and does not provide legal advice. For decisions with serious consequences, speak to a qualified solicitor.",
  },
  {
    question: "Which file types can I upload?",
    answer:
      "PDF and DOCX. Scanned documents work best when the text is selectable — photos of paper contracts may lose accuracy.",
  },
  {
    question: "Is my contract private?",
    answer:
      "Yes. Your documents are stored encrypted, are only visible to your account, and are never used to train AI models. You can delete a document at any time and it is removed from our storage.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Any time, in one click from your billing settings. You keep Pro features until the end of the period you've paid for, and your documents stay accessible on the Free plan.",
  },
  {
    question: "What contracts work best?",
    answer:
      "Everyday UK agreements: tenancy agreements, employment contracts, freelance and consulting agreements, NDAs and service contracts. Very long or heavily bespoke commercial contracts may need a solicitor's eye on top.",
  },
  {
    question: "How accurate is it?",
    answer:
      "The AI cites the exact paragraphs it relies on, so you can verify every claim against the original text yourself. Treat it as a very fast first read — not the final word.",
  },
  {
    question: "Do you support contracts from outside the UK?",
    answer:
      "The analysis is tuned for documents governed by the law of England, Wales, Scotland or Northern Ireland. Other jurisdictions will still get a useful summary, but risk checks reference UK law.",
  },
];

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
