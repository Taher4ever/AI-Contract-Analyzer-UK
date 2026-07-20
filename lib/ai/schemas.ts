import { z } from "zod";

const severitySchema = z.enum(["info", "warning", "danger"]);
const riskLevelSchema = z.enum(["low", "medium", "high"]);
const contractTypeSchema = z.enum([
  "tenancy",
  "employment",
  "freelance",
  "nda",
  "other",
]);
const timelineTypeSchema = z.enum([
  "renewal",
  "termination",
  "deadline",
  "payment",
]);

const findingSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  severity: severitySchema,
  paragraphIds: z.array(z.number().int()),
});

const noticePeriodSchema = z.object({
  value: z.string().nullable(),
  explanation: z.string(),
  paragraphIds: z.array(z.number().int()),
});

const autoRenewalSchema = z.object({
  present: z.boolean(),
  explanation: z.string(),
  paragraphIds: z.array(z.number().int()),
});

const missingClauseSchema = z.object({
  title: z.string(),
  whyItMatters: z.string(),
});

const timelineEntrySchema = z.object({
  date: z.string().nullable(),
  label: z.string(),
  type: timelineTypeSchema,
  explanation: z.string(),
  paragraphIds: z.array(z.number().int()),
});

export const analysisSchema = z.object({
  riskScore: z.number().int().min(0).max(100),
  riskLevel: riskLevelSchema,
  riskExplanation: z.string(),
  summary: z.string(),
  contractType: contractTypeSchema,
  sections: z.object({
    hiddenRisks: z.array(findingSchema),
    importantClauses: z.array(findingSchema),
    financialObligations: z.array(findingSchema),
    terminationClauses: z.array(findingSchema),
    cancellationRules: z.array(findingSchema),
  }),
  noticePeriod: noticePeriodSchema,
  autoRenewal: autoRenewalSchema,
  missingClauses: z.array(missingClauseSchema),
  timeline: z.array(timelineEntrySchema),
  recommendedQuestions: z.array(z.string()),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type ContractType = z.infer<typeof contractTypeSchema>;

// Shape of the `sections` jsonb column as written by app/api/analyze/route.ts —
// a repacking of `analysisSchema` into the 3 flexible columns Phase 4's schema allocated.
export const storedSectionsSchema = z.object({
  riskLevel: riskLevelSchema,
  riskExplanation: z.string(),
  contractType: contractTypeSchema,
  findings: z.object({
    hiddenRisks: z.array(findingSchema),
    importantClauses: z.array(findingSchema),
    financialObligations: z.array(findingSchema),
    terminationClauses: z.array(findingSchema),
    cancellationRules: z.array(findingSchema),
  }),
  noticePeriod: noticePeriodSchema,
  autoRenewal: autoRenewalSchema,
  missingClauses: z.array(missingClauseSchema),
});

export const timelineSchema = z.array(timelineEntrySchema);
export const recommendedQuestionsSchema = z.array(z.string());

export type StoredSections = z.infer<typeof storedSectionsSchema>;
export type NoticePeriod = z.infer<typeof noticePeriodSchema>;
export type AutoRenewal = z.infer<typeof autoRenewalSchema>;
export type MissingClause = z.infer<typeof missingClauseSchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;
export type TimelineType = z.infer<typeof timelineTypeSchema>;
