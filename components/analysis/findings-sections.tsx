import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FindingCard } from "./finding-card";
import type { StoredSections } from "@/lib/ai/schemas";

const SECTIONS: { key: keyof StoredSections["findings"]; label: string }[] = [
  { key: "hiddenRisks", label: "Hidden Risks" },
  { key: "importantClauses", label: "Important Clauses" },
  { key: "financialObligations", label: "Financial Obligations" },
  { key: "terminationClauses", label: "Termination Clauses" },
  { key: "cancellationRules", label: "Cancellation Rules" },
];

export function FindingsSections({
  findings,
}: {
  findings: StoredSections["findings"];
}) {
  return (
    <div className="glass shadow-soft rounded-2xl px-4 py-1">
      <Accordion multiple defaultValue={SECTIONS.map((s) => s.key)}>
        {SECTIONS.map((section) => {
          const items = findings[section.key];
          return (
            <AccordionItem key={section.key} value={section.key}>
              <AccordionTrigger>
                <span>
                  {section.label}
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    {items.length}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nothing flagged in this category.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.map((finding, i) => (
                      <FindingCard key={i} finding={finding} />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
