"use client";

import { HighlightProvider, useHighlight } from "./highlight-context";
import { RiskScore } from "./risk-score";
import { FindingsSections } from "./findings-sections";
import { KeyFacts } from "./key-facts";
import { MissingClauses } from "./missing-clauses";
import { RecommendedQuestions } from "./recommended-questions";
import { Timeline } from "./timeline";
import { ContractViewer } from "./contract-viewer";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Paragraph } from "@/types/database";
import type { StoredSections, TimelineEntry } from "@/lib/ai/schemas";

interface SharedAnalysisViewProps {
  paragraphs: Paragraph[];
  riskScore: number;
  summary: string;
  sections: StoredSections;
  timeline: TimelineEntry[];
  recommendedQuestions: string[];
}

export function SharedAnalysisView(props: SharedAnalysisViewProps) {
  return (
    <HighlightProvider>
      <SharedAnalysisContent {...props} />
    </HighlightProvider>
  );
}

function SharedAnalysisContent({
  paragraphs,
  riskScore,
  summary,
  sections,
  timeline,
  recommendedQuestions,
}: SharedAnalysisViewProps) {
  const { activeTab, setActiveTab } = useHighlight();
  const mobileTab = activeTab === "chat" ? "analysis" : activeTab;

  const reportContent = (
    <FadeInStagger faster className="space-y-6">
      <FadeIn>
        <RiskScore
          score={riskScore}
          level={sections.riskLevel}
          explanation={sections.riskExplanation}
        />
      </FadeIn>
      <FadeIn className="glass shadow-soft rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
          {summary}
        </p>
      </FadeIn>
      <FadeIn>
        <FindingsSections findings={sections.findings} showAskAi={false} />
      </FadeIn>
      <FadeIn>
        <KeyFacts
          noticePeriod={sections.noticePeriod}
          autoRenewal={sections.autoRenewal}
        />
      </FadeIn>
      <FadeIn>
        <MissingClauses clauses={sections.missingClauses} />
      </FadeIn>
      <FadeIn>
        <RecommendedQuestions questions={recommendedQuestions} />
      </FadeIn>
      <FadeIn>
        <Timeline entries={timeline} />
      </FadeIn>
    </FadeInStagger>
  );

  const contractContent = (
    <div className="glass shadow-soft h-full rounded-2xl p-4">
      <ContractViewer paragraphs={paragraphs} />
    </div>
  );

  return (
    <div>
      <div className="hidden gap-6 lg:grid lg:grid-cols-[55%_45%]">
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 pb-6">
          {reportContent}
        </div>
        <div className="sticky top-6 h-[calc(100vh-9rem)] overflow-y-auto">
          {contractContent}
        </div>
      </div>

      <Tabs
        value={mobileTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="lg:hidden"
      >
        <TabsList className="w-full">
          <TabsTrigger value="analysis" className="flex-1">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex-1">
            Contract
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-4">
          {reportContent}
        </TabsContent>
        <TabsContent value="contract" className="mt-4">
          {contractContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
