"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type AnalysisTab = "analysis" | "contract" | "chat";

interface HighlightContextValue {
  highlightedIds: Set<number>;
  highlight: (paragraphIds: number[]) => void;
  activeTab: AnalysisTab;
  setActiveTab: (tab: AnalysisTab) => void;
  chatDraft: string;
  setChatDraft: (text: string) => void;
  askAboutFinding: (question: string) => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

export function HighlightProvider({ children }: { children: React.ReactNode }) {
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<AnalysisTab>("analysis");
  const [chatDraft, setChatDraft] = useState("");

  const highlight = useCallback((paragraphIds: number[]) => {
    if (paragraphIds.length === 0) return;
    setHighlightedIds(new Set(paragraphIds));
    setActiveTab("contract");
  }, []);

  const askAboutFinding = useCallback((question: string) => {
    setChatDraft(question);
    setActiveTab("chat");
  }, []);

  const value = useMemo(
    () => ({
      highlightedIds,
      highlight,
      activeTab,
      setActiveTab,
      chatDraft,
      setChatDraft,
      askAboutFinding,
    }),
    [highlightedIds, highlight, activeTab, chatDraft, askAboutFinding]
  );

  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>;
}

export function useHighlight() {
  const ctx = useContext(HighlightContext);
  if (!ctx) throw new Error("useHighlight must be used within a HighlightProvider");
  return ctx;
}
