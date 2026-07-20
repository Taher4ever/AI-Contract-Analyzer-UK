import { z } from "zod";

const severitySchema = z.enum(["info", "warning", "danger"]);

const findingSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  severity: severitySchema,
  paragraphIds: z.array(z.number().int()),
});

export const analysisSchema = z.object({
  riskScore: z.number().int().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high"]),
  riskExplanation: z.string(),
  summary: z.string(),
  contractType: z.enum([
    "tenancy",
    "employment",
    "freelance",
    "nda",
    "other",
  ]),
  sections: z.object({
    hiddenRisks: z.array(findingSchema),
    importantClauses: z.array(findingSchema),
    financialObligations: z.array(findingSchema),
    terminationClauses: z.array(findingSchema),
    cancellationRules: z.array(findingSchema),
  }),
  noticePeriod: z.object({
    value: z.string().nullable(),
    explanation: z.string(),
    paragraphIds: z.array(z.number().int()),
  }),
  autoRenewal: z.object({
    present: z.boolean(),
    explanation: z.string(),
    paragraphIds: z.array(z.number().int()),
  }),
  missingClauses: z.array(
    z.object({ title: z.string(), whyItMatters: z.string() })
  ),
  timeline: z.array(
    z.object({
      date: z.string().nullable(),
      label: z.string(),
      type: z.enum(["renewal", "termination", "deadline", "payment"]),
      explanation: z.string(),
      paragraphIds: z.array(z.number().int()),
    })
  ),
  recommendedQuestions: z.array(z.string()),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type Finding = z.infer<typeof findingSchema>;
