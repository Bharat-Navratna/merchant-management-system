"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { KybSlaUrgency } from "@/lib/types";

function computeUrgency(msRemaining: number): KybSlaUrgency {
  if (msRemaining <= 0) return "breached";
  if (msRemaining < 4 * 60 * 60 * 1000) return "critical";
  if (msRemaining < 12 * 60 * 60 * 1000) return "warning";
  return "normal";
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "BREACHED";
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const URGENCY_CLS: Record<KybSlaUrgency, string> = {
  normal:   "text-muted-foreground font-mono text-[11px]",
  warning:  "text-yellow-300 font-mono text-[11px] bg-yellow-500/10 px-1.5 py-0.5 rounded",
  critical: "text-destructive font-mono text-[11px] bg-destructive/10 px-1.5 py-0.5 rounded",
  breached: "text-destructive font-mono text-[11px] bg-destructive/20 px-1.5 py-0.5 rounded animate-pulse",
};

interface KybSlaBadgeProps {
  deadlineIso: string;
  className?: string;
}

export function KybSlaBadge({ deadlineIso, className }: KybSlaBadgeProps) {
  const [msRemaining, setMsRemaining] = useState(
    () => new Date(deadlineIso).getTime() - Date.now(),
  );

  useEffect(() => {
    // Tick once per second while the SLA is not yet breached.
    if (msRemaining <= 0) return;
    const id = setInterval(() => {
      const remaining = new Date(deadlineIso).getTime() - Date.now();
      setMsRemaining(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [deadlineIso, msRemaining]);

  const urgency = computeUrgency(msRemaining);

  return (
    <span
      className={cn(URGENCY_CLS[urgency], className)}
      aria-label={`SLA: ${formatRemaining(msRemaining)} remaining`}
    >
      {formatRemaining(msRemaining)}
    </span>
  );
}

