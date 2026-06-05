"use client";

import { Activity, AlertCircle, CheckCircle2, RadioTower, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/ui/metric-card";
import { WebhookOpsStats } from "@/lib/types";

interface WebhookSummaryCardsProps {
  stats: WebhookOpsStats;
  isLoading?: boolean;
}

export function WebhookSummaryCards({ stats, isLoading }: WebhookSummaryCardsProps) {
  const cards = [
    {
      id: "success-rate",
      label: "Delivery Success Rate",
      value: `${stats.deliverySuccessRate.toFixed(2)}%`,
      detail: "24-hour average",
      icon: CheckCircle2,
      tone: "success" as const,
    },
    {
      id: "pending",
      label: "Pending Deliveries",
      value: stats.pendingDeliveries.toString(),
      detail: "Active in queue",
      icon: Zap,
      tone: "info" as const,
    },
    {
      id: "failed",
      label: "Failed Deliveries",
      value: stats.failedDeliveries.toString(),
      detail: "Requires action",
      icon: AlertCircle,
      tone: "warning" as const,
    },
    {
      id: "dlq",
      label: "Dead Letter Queue",
      value: stats.deadLetterQueue.toString(),
      detail: "Manual replay needed",
      icon: AlertCircle,
      tone: "destructive" as const,
    },
    {
      id: "latency",
      label: "Average Latency",
      value: `${stats.averageLatency}ms`,
      detail: "P95 delivery time",
      icon: Activity,
      tone: "secondary" as const,
    },
    {
      id: "subscriptions",
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toString(),
      detail: "Registered endpoints",
      icon: RadioTower,
      tone: "primary" as const,
    },
  ];

  const toneClasses = {
    success: "bg-success/10 text-success",
    info: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    secondary: "bg-secondary/10 text-secondary",
    primary: "bg-tertiary/10 text-tertiary",
  };

  const labelClasses = {
    success: "text-success",
    info: "text-primary",
    warning: "text-warning",
    destructive: "text-destructive",
    secondary: "text-secondary",
    primary: "text-tertiary",
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="relative">
            <MetricCard
              label={card.label}
              value={card.value}
              detail={card.detail}
              icon={Icon}
              toneClass={cn(toneClasses[card.tone], labelClasses[card.tone], "border-transparent")}
            />
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              )}
          </div>
        );
      })}
    </div>
  );
}

