import {
  CheckCircle2,
  AlertCircle,
  Clock,
  MinusCircle,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityPostureItem, SecurityPostureStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  SecurityPostureStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  enabled: {
    label: "Enabled",
    icon: CheckCircle2,
    className: "text-success",
  },
  partial: {
    label: "Partial",
    icon: MinusCircle,
    className: "text-warning",
  },
  planned: {
    label: "Planned",
    icon: Clock,
    className: "text-primary",
  },
  action_required: {
    label: "Action Required",
    icon: AlertCircle,
    className: "text-destructive",
  },
};

const colorMap: Record<SecurityPostureItem["color"], { border: string; bg: string; icon: string }> = {
  primary: { border: "border-l-primary", bg: "bg-primary/5", icon: "text-primary bg-primary/10" },
  secondary: { border: "border-l-secondary", bg: "bg-secondary/5", icon: "text-secondary bg-secondary/10" },
  tertiary: { border: "border-l-tertiary", bg: "bg-tertiary/5", icon: "text-tertiary bg-tertiary/10" },
  success: { border: "border-l-success", bg: "bg-success/5", icon: "text-success bg-success/10" },
  warning: { border: "border-l-warning", bg: "bg-warning/5", icon: "text-warning bg-warning/10" },
  destructive: { border: "border-l-destructive", bg: "bg-destructive/5", icon: "text-destructive bg-destructive/10" },
};

export function SecurityPostureChecklist({ items }: { items: SecurityPostureItem[] }) {
  const enabledCount = items.filter((i) => i.status === "enabled").length;

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-success" />
              Security Posture Checklist
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform hardening controls and their current enforcement status.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            {enabledCount}/{items.length} enabled
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const colorCfg = colorMap[item.color];
          const statusCfg = statusConfig[item.status];
          const StatusIcon = statusCfg.icon;

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border border-l-4 p-4",
                colorCfg.border,
                colorCfg.bg,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={cn("rounded-lg p-2", colorCfg.icon)}>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <StatusIcon className={cn("h-4 w-4 shrink-0", statusCfg.className)} />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">{item.label}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <span
                className={cn(
                  "mt-3 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  statusCfg.className,
                )}
              >
                {statusCfg.label}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

