import type { ComponentType } from "react";
import { Activity, AlertTriangle, Eye, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { RiskOverviewStats } from "@/lib/types";

type SummaryItem = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  tone: "danger" | "warning" | "success" | "primary" | "secondary" | "tertiary";
};

const toneStyles: Record<SummaryItem["tone"], string> = {
  danger: "text-destructive bg-destructive/10 border-destructive/25",
  warning: "text-warning bg-warning/10 border-warning/25",
  success: "text-success bg-success/10 border-success/25",
  primary: "text-primary bg-primary/10 border-primary/25",
  secondary: "text-secondary bg-secondary/10 border-secondary/25",
  tertiary: "text-tertiary bg-tertiary/10 border-tertiary/25",
};

export function RiskSummaryCards({ stats }: { stats: RiskOverviewStats }) {
  const items: SummaryItem[] = [
    {
      label: "High Risk Merchants",
      value: stats.highRiskMerchants.toLocaleString(),
      detail: "Needs senior review",
      icon: ShieldAlert,
      tone: "danger",
    },
    {
      label: "Medium Risk Merchants",
      value: stats.mediumRiskMerchants.toLocaleString(),
      detail: "Enhanced monitoring",
      icon: AlertTriangle,
      tone: "warning",
    },
    {
      label: "Low Risk Merchants",
      value: stats.lowRiskMerchants.toLocaleString(),
      detail: "Auto-triaged clean",
      icon: ShieldCheck,
      tone: "success",
    },
    {
      label: "Average Risk Score",
      value: stats.averageRiskScore.toFixed(1),
      detail: "+4.2% from 24h",
      icon: TrendingUp,
      tone: "tertiary",
    },
    {
      label: "Watchlist Matches",
      value: stats.watchlistMatches.toLocaleString(),
      detail: "Manual review queue",
      icon: Eye,
      tone: "secondary",
    },
    {
      label: "Rules Triggered",
      value: stats.rulesTriggered.toLocaleString(),
      detail: "Across live rules",
      icon: Activity,
      tone: "primary",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            icon={Icon}
            toneClass={toneStyles[item.tone]}
          />
        );
      })}
    </div>
  );
}

