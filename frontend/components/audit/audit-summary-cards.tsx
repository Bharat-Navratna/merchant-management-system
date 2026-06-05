import { Download, FileCheck2, FileSearch, KeyRound, RotateCcw, ShieldAlert } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { AuditSummaryStats } from "@/lib/types";

export function AuditSummaryCards({ stats }: { stats: AuditSummaryStats }) {
  const cards = [
    {
      label: "Events Today",
      value: stats.eventsToday.toLocaleString(),
      detail: "Immutable records",
      icon: FileSearch,
      tone: "text-primary bg-primary/10 border-primary/25",
    },
    {
      label: "High Severity Events",
      value: stats.highSeverityEvents.toLocaleString(),
      detail: "Needs attention",
      icon: ShieldAlert,
      tone: "text-destructive bg-destructive/10 border-destructive/25",
    },
    {
      label: "Failed Login Events",
      value: stats.failedLoginEvents.toLocaleString(),
      detail: "Auth lockouts",
      icon: KeyRound,
      tone: "text-warning bg-warning/10 border-warning/25",
    },
    {
      label: "Webhook Replay Events",
      value: stats.webhookReplayEvents.toLocaleString(),
      detail: "Manual replay actions",
      icon: RotateCcw,
      tone: "text-secondary bg-secondary/10 border-secondary/25",
    },
    {
      label: "Status Changes",
      value: stats.statusChanges.toLocaleString(),
      detail: "Lifecycle updates",
      icon: FileCheck2,
      tone: "text-tertiary bg-tertiary/10 border-tertiary/25",
    },
    {
      label: "Document Access Events",
      value: stats.documentAccessEvents.toLocaleString(),
      detail: "Private KYB files",
      icon: Download,
      tone: "text-success bg-success/10 border-success/25",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            icon={Icon}
            toneClass={card.tone}
          />
        );
      })}
    </div>
  );
}

