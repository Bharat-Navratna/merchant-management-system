import {
  Activity,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SecuritySummaryStats } from "@/lib/types";

export function SecuritySummaryCards({ stats }: { stats: SecuritySummaryStats }) {
  const cards = [
    {
      label: "Active Sessions",
      value: stats.activeSessions.toLocaleString(),
      detail: "Unique operator devices",
      icon: Activity,
      tone: "text-primary bg-primary/10 border-primary/25",
    },
    {
      label: "Failed Logins",
      value: stats.failedLogins.toLocaleString(),
      detail: "Last 24 hours",
      icon: KeyRound,
      tone: "text-warning bg-warning/10 border-warning/25",
    },
    {
      label: "Locked Accounts",
      value: stats.lockedAccounts.toLocaleString(),
      detail: "Requires operator action",
      icon: Lock,
      tone: "text-destructive bg-destructive/10 border-destructive/25",
    },
    {
      label: "MFA Coverage",
      value: stats.mfaCoverage,
      detail: "Operator MFA enrollment",
      icon: ShieldCheck,
      tone: "text-success bg-success/10 border-success/25",
    },
    {
      label: "Admin Users",
      value: stats.adminUsers.toLocaleString(),
      detail: "Super Admin access",
      icon: Users,
      tone: "text-secondary bg-secondary/10 border-secondary/25",
    },
    {
      label: "Rate Limit Events",
      value: stats.rateLimitEvents.toLocaleString(),
      detail: "Requests throttled",
      icon: ShieldAlert,
      tone: "text-tertiary bg-tertiary/10 border-tertiary/25",
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

