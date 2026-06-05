"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { WebhookDeliveryStatus } from "@/lib/types";

interface WebhookDeliveryStatusBadgeProps {
  status: WebhookDeliveryStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  WebhookDeliveryStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  retrying: {
    label: "Retrying",
    icon: Zap,
    className: "bg-warning/10 text-warning border-warning/30 animate-pulse",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  dead_lettered: {
    label: "Dead Lettered",
    icon: AlertCircle,
    className: "bg-destructive/15 text-destructive border-destructive/40",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-secondary/10 text-secondary border-secondary/30",
  },
};

export function WebhookDeliveryStatusBadge({
  status,
  className,
  showIcon = true,
}: WebhookDeliveryStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className={cn("h-3 w-3", status === "in_progress" && "animate-spin")} />}
      <span>{config.label}</span>
    </div>
  );
}

