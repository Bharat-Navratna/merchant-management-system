"use client";

import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuspiciousActivity, SuspiciousActivitySeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  SuspiciousActivitySeverity,
  { className: string; borderClass: string }
> = {
  critical: {
    className: "border-destructive/40 bg-destructive/15 text-destructive",
    borderClass: "border-l-destructive",
  },
  high: {
    className: "border-destructive/25 bg-destructive/10 text-destructive",
    borderClass: "border-l-destructive/60",
  },
  medium: {
    className: "border-warning/30 bg-warning/10 text-warning",
    borderClass: "border-l-warning",
  },
  low: {
    className: "border-success/25 bg-success/10 text-success",
    borderClass: "border-l-success",
  },
};

const statusConfig: Record<SuspiciousActivity["status"], string> = {
  open: "border-destructive/25 bg-destructive/10 text-destructive",
  investigating: "border-warning/25 bg-warning/10 text-warning",
  resolved: "border-success/25 bg-success/10 text-success",
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

export function SuspiciousActivityPanel({ activities }: { activities: SuspiciousActivity[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Suspicious Activity &amp; Alerts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Failed logins, anomalous geo-hops, brute force attempts, and lockout events.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-medium">No suspicious activity detected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Anomalous events will appear here when the risk engine triggers alerts.
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const sevCfg = severityConfig[activity.severity];
            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-4 rounded-xl border border-l-4 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]",
                  sevCfg.borderClass,
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    activity.severity === "critical" || activity.severity === "high"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning",
                  )}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="break-all font-mono text-xs text-primary" title={activity.actor}>
                      {activity.actor}
                    </code>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase",
                        sevCfg.className,
                      )}
                    >
                      {activity.severity}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        statusConfig[activity.status],
                      )}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {activity.reason}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <code className="font-mono text-foreground/60" title={activity.ipAddress}>
                      {activity.ipAddress}
                    </code>
                    {activity.attempts > 1 && (
                      <span>{activity.attempts} attempts</span>
                    )}
                    <time>{formatTimestamp(activity.timestamp)}</time>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-primary"
                  onClick={() => toast.info(`Investigation workflow for ${activity.id} is not connected in this preview.`)}
                >
                  Investigate
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

