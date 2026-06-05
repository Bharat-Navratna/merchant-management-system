import { Activity, AlertTriangle, Clock3, Database, Gauge, RadioTower, ServerCog, ShieldCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { ObservabilitySummaryStats } from "@/lib/types";

export function ObservabilitySummaryCards({ stats }: { stats: ObservabilitySummaryStats }) {
  const cards = [
    { label: "API p95 Latency", value: stats.apiP95Latency, detail: "Gateway edge", icon: Gauge, tone: "text-primary bg-primary/10 border-primary/25" },
    { label: "Error Rate", value: stats.errorRate, detail: "Last 15 minutes", icon: AlertTriangle, tone: "text-success bg-success/10 border-success/25" },
    { label: "Request Volume", value: stats.requestVolume, detail: "Today", icon: Activity, tone: "text-tertiary bg-tertiary/10 border-tertiary/25" },
    { label: "Database Health", value: stats.databaseHealth, detail: "Primary pool", icon: Database, tone: "text-success bg-success/10 border-success/25" },
    { label: "Worker Lag", value: stats.workerLag, detail: "Webhook lane", icon: Clock3, tone: "text-warning bg-warning/10 border-warning/25" },
    { label: "Webhook Queue Depth", value: stats.webhookQueueDepth, detail: "Pending + retry", icon: RadioTower, tone: "text-secondary bg-secondary/10 border-secondary/25" },
    { label: "Failed Jobs", value: stats.failedJobs, detail: "Needs triage", icon: ServerCog, tone: "text-destructive bg-destructive/10 border-destructive/25" },
    { label: "Uptime / Availability", value: stats.uptime, detail: "Rolling 30 days", icon: ShieldCheck, tone: "text-success bg-success/10 border-success/25" },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-3.5">
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

