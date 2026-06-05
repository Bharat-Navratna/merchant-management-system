import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert, Store } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Merchant } from "@/lib/types";
import { cn } from "@/lib/utils";

type SummaryCard = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "secondary" | "success" | "warning" | "danger";
};

const toneClass = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function MerchantSummaryCards({ merchants }: { merchants: Merchant[] }) {
  const cards: SummaryCard[] = [
    {
      label: "Total Merchants",
      value: merchants.length,
      icon: Store,
      tone: "primary",
    },
    {
      label: "Pending KYB",
      value: merchants.filter((merchant) => merchant.kybStatus === "pending" || merchant.kybStatus === "under review").length,
      icon: Clock3,
      tone: "secondary",
    },
    {
      label: "Active",
      value: merchants.filter((merchant) => merchant.status === "active").length,
      icon: CheckCircle2,
      tone: "success",
    },
    {
      label: "Suspended",
      value: merchants.filter((merchant) => ["suspended", "restricted", "failed"].includes(merchant.status)).length,
      icon: AlertTriangle,
      tone: "warning",
    },
    {
      label: "High Risk",
      value: merchants.filter((merchant) => merchant.riskLevel === "high" || merchant.riskLevel === "critical").length,
      icon: ShieldAlert,
      tone: "danger",
    },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value.toLocaleString()}
          icon={card.icon}
          toneClass={cn(toneClass[card.tone], "border-white/10 bg-white/[0.03]")}
        />
      ))}
    </section>
  );
}

