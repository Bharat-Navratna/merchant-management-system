"use client";

import { useState } from "react";
import { ClipboardCheck, CheckSquare, Square, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { KybChecklistItem } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface KybReviewChecklistProps {
  items: KybChecklistItem[];
  onChange?: (updatedItems: KybChecklistItem[]) => void;
}

export function KybReviewChecklist({ items, onChange }: KybReviewChecklistProps) {
  // Local state so the checklist can be interactive even when the parent
  // hasn't wired up a handler yet (e.g. mock mode).
  const [localItems, setLocalItems] = useState<KybChecklistItem[]>(items);

  // Sync if parent replaces the prop (e.g. switching queue entry).
  const displayItems = onChange ? items : localItems;

  function toggle(id: string) {
    const updated = (onChange ? items : localItems).map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    if (onChange) {
      onChange(updated);
    } else {
      setLocalItems(updated);
    }
  }

  const checkedCount = displayItems.filter((i) => i.checked).length;
  const requiredCount = displayItems.filter((i) => i.required).length;
  const requiredChecked = displayItems.filter((i) => i.required && i.checked).length;
  const allRequiredDone = requiredChecked === requiredCount;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardCheck className="size-4 text-tertiary" />
            Verification Checklist
          </CardTitle>
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              allRequiredDone
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                : "bg-white/5 text-muted-foreground border-white/10",
            )}
          >
            {checkedCount}/{displayItems.length} complete
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-1.5">
        {displayItems.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">
            No checklist items for this entry.
          </p>
        ) : (
          displayItems.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-150",
                "border border-transparent",
                item.checked
                  ? "bg-emerald-500/[0.06] border-emerald-500/15"
                  : "bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="mt-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
                aria-checked={item.checked}
                aria-label={`${item.checked ? "Mark incomplete" : "Mark complete"}: ${item.label}`}
                role="checkbox"
              >
                {item.checked ? (
                  <CheckSquare className="size-4 text-emerald-400" />
                ) : (
                  <Square className="size-4 text-muted-foreground" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight",
                      item.checked ? "text-foreground/70 line-through decoration-muted-foreground/40" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </p>
                  {item.required && (
                    <span className="text-[9px] text-destructive/70 font-semibold uppercase tracking-wider shrink-0">
                      required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </label>
          ))
        )}

        {!allRequiredDone && requiredCount > 0 && (
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
            <Lock className="size-3" />
            {requiredCount - requiredChecked} required{" "}
            {requiredCount - requiredChecked === 1 ? "item" : "items"} still unchecked
          </p>
        )}
      </CardContent>
    </Card>
  );
}

