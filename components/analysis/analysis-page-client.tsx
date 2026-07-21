"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HighlightProvider, useHighlight } from "./highlight-context";
import { AnalysisHeader } from "./analysis-header";
import { RiskScore } from "./risk-score";
import { FindingsSections } from "./findings-sections";
import { KeyFacts } from "./key-facts";
import { MissingClauses } from "./missing-clauses";
import { RecommendedQuestions } from "./recommended-questions";
import { Timeline } from "./timeline";
import { ContractViewer } from "./contract-viewer";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChatMessageData } from "@/components/chat/chat-panel";
import type { Paragraph, Plan } from "@/types/database";
import type { ContractType, StoredSections, TimelineEntry } from "@/lib/ai/schemas";

// Only ever rendered client-side once the Chat tab is opened — dynamic-import
// so react-markdown and the chat UI aren't in the initial analysis page bundle.
const ChatPanel = dynamic(
  () => import("@/components/chat/chat-panel").then((m) => m.ChatPanel),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100vh-16rem)] rounded-2xl lg:h-full" />,
  }
);

interface AnalysisPageClientProps {
  contractId: string;
  title: string;
  createdAt: string;
  isFavorite: boolean;
  paragraphs: Paragraph[];
  riskScore: number;
  summary: string;
  sections: StoredSections;
  timeline: TimelineEntry[];
  recommendedQuestions: string[];
  initialChatMessages: ChatMessageData[];
  folderId: string | null;
  folders: { id: string; name: string }[];
  plan: Plan;
  shareToken: string | null;
}

function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export function AnalysisPageClient(props: AnalysisPageClientProps) {
  return (
    <HighlightProvider>
      <AnalysisPageContent {...props} />
    </HighlightProvider>
  );
}

function AnalysisPageContent({
  contractId,
  title,
  createdAt,
  isFavorite,
  paragraphs,
  riskScore,
  summary,
  sections,
  timeline,
  recommendedQuestions,
  initialChatMessages,
  folderId,
  folders,
  plan,
  shareToken,
}: AnalysisPageClientProps) {
  const { activeTab, setActiveTab } = useHighlight();
  const isDesktop = useIsDesktop();

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
        <FindingsSections findings={sections.findings} />
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

  const chatSkeleton = <Skeleton className="h-[calc(100vh-16rem)] rounded-2xl lg:h-full" />;
  const chatContent = (
    <ChatPanel
      contractId={contractId}
      initialMessages={initialChatMessages}
      recommendedQuestions={recommendedQuestions}
    />
  );

  const desktopRightTab = activeTab === "chat" ? "chat" : "contract";

  return (
    <div className="p-6 lg:p-8">
      <AnalysisHeader
        contractId={contractId}
        title={title}
        createdAt={createdAt}
        isFavorite={isFavorite}
        contractType={sections.contractType as ContractType}
        folderId={folderId}
        folders={folders}
        plan={plan}
        shareToken={shareToken}
      />

      <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-[55%_45%]">
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 pb-6">
          {reportContent}
        </div>
        <div className="sticky top-6 flex h-[calc(100vh-9rem)] flex-col self-start">
          <Tabs
            value={desktopRightTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="flex h-full flex-col"
          >
            <TabsList className="w-fit">
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="contract" className="mt-3 min-h-0 flex-1 overflow-y-auto">
              {contractContent}
            </TabsContent>
            <TabsContent value="chat" className="mt-3 min-h-0 flex-1">
              {isDesktop === null ? chatSkeleton : isDesktop && chatContent}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="mt-6 lg:hidden"
      >
        <TabsList className="w-full">
          <TabsTrigger value="analysis" className="flex-1">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex-1">
            Contract
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">
            Chat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-4">
          {reportContent}
        </TabsContent>
        <TabsContent value="contract" className="mt-4">
          {contractContent}
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          {isDesktop === null ? chatSkeleton : isDesktop === false && chatContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
