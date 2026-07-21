"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  searchContracts,
  type SearchResult,
} from "@/app/(app)/dashboard/contracts/actions";

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setHighlightedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const found = await searchContracts(query);
      setResults(found);
      setHighlightedIndex(0);
      setIsSearching(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const select = (result: SearchResult) => {
    setOpen(false);
    router.push(`/dashboard/contracts/${result.id}`);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const result = results[highlightedIndex];
      if (result) select(result);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-input bg-background hover:bg-muted text-muted-foreground relative hidden h-8 w-56 items-center gap-2 rounded-full border pl-9 text-sm sm:flex"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        Search contracts…
        <kbd className="bg-muted text-muted-foreground mr-2 ml-auto hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[18%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
        >
          <DialogTitle className="sr-only">Search contracts</DialogTitle>
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="text-muted-foreground size-4 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search by title or contract type…"
              aria-label="Search contracts"
              className="placeholder:text-muted-foreground h-11 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-1.5">
            {!query.trim() ? (
              <p className="text-muted-foreground p-4 text-center text-sm">
                Start typing to search your contracts.
              </p>
            ) : isSearching ? (
              <p className="text-muted-foreground p-4 text-center text-sm">
                Searching…
              </p>
            ) : results.length === 0 ? (
              <p className="text-muted-foreground p-4 text-center text-sm">
                No contracts found.
              </p>
            ) : (
              results.map((result, i) => (
                <button
                  key={result.id}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => select(result)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                    i === highlightedIndex && "bg-accent text-accent-foreground"
                  )}
                >
                  <FileText className="text-muted-foreground size-4 shrink-0" />
                  <span className="truncate">{result.title}</span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
