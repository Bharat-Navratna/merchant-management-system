"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { KybQueueEntry } from "@/lib/types";
import { KybQueueItem } from "@/components/kyb/kyb-queue-item";
import { Skeleton } from "@/components/ui/skeleton";

type FilterKey = "all" | "urgent" | "high" | "unassigned";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "urgent", label: "Urgent" },
  { key: "high", label: "High" },
  { key: "unassigned", label: "Unassigned" },
];

interface KybReviewQueueProps {
  entries: KybQueueEntry[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function KybReviewQueue({
  entries,
  isLoading,
  selectedId,
  onSelect,
  className,
}: KybReviewQueueProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    let list = entries;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.merchantName.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q),
      );
    }

    if (filter === "urgent") list = list.filter((e) => e.priority === "urgent");
    if (filter === "high") list = list.filter((e) => e.riskLevel === "high" || e.riskLevel === "critical");
    if (filter === "unassigned") list = list.filter((e) => e.assignedReviewer === "Unassigned");

    return list;
  }, [entries, search, filter]);

  return (
    <aside
      className={cn("glass-panel rounded-xl flex flex-col overflow-hidden", className)}
      aria-label="KYB review queue"
    >
      <div className="px-4 py-3 border-b border-white/[0.07] bg-white/[0.03] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Review Queue</span>
          <span className="text-[10px] text-muted-foreground bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">
            {entries.length} items
          </span>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queue..."
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            aria-label="Search review queue"
          />
        </div>

        <div className="flex gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={cn(
                "flex-1 text-[10px] uppercase tracking-wider font-semibold py-1 rounded transition-all",
                filter === key
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="px-1.5 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all"
            title="More filters"
            aria-label="More filter options"
          >
            <SlidersHorizontal className="size-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-px p-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <Inbox className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {search ? "No matching merchants found." : "Queue is empty."}
            </p>
          </div>
        ) : (
          filtered.map((entry) => (
            <KybQueueItem
              key={entry.id}
              entry={entry}
              isSelected={selectedId === entry.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </aside>
  );
}

