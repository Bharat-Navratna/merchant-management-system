"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WebhookRetryQueueProps {
  breakdown: {
    pending: number;
    in_progress: number;
    retrying: number;
    failed: number;
    dead_lettered: number;
  };
}

const queueStatuses = [
  { id: "pending", label: "Pending", color: "bg-primary", textColor: "text-primary" },
  { id: "in_progress", label: "In Progress", color: "bg-secondary", textColor: "text-secondary" },
  { id: "retrying", label: "Retrying", color: "bg-warning", textColor: "text-warning" },
  { id: "failed", label: "Failed", color: "bg-destructive", textColor: "text-destructive" },
  { id: "dead_lettered", label: "Dead Lettered", color: "bg-destructive/70", textColor: "text-destructive" },
];

export function WebhookRetryQueue({ breakdown }: WebhookRetryQueueProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Retry Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {queueStatuses.map((status) => {
            const value = breakdown[status.id as keyof typeof breakdown] || 0;
            const percentage = total > 0 ? (value / total) * 100 : 0;

            return (
              <div key={status.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{status.label}</span>
                  <span className={cn("font-semibold", status.textColor)}>{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full transition-all", status.color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Total in queue</p>
            <p className="font-display text-lg font-bold text-foreground">{total}</p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
          <p className="text-xs text-primary">
            Events are processed asynchronously. Retries happen with exponential backoff.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

