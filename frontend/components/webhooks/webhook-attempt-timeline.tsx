"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WebhookAttempt } from "@/lib/types";

interface WebhookAttemptTimelineProps {
  attempts: WebhookAttempt[];
  className?: string;
}

const statusIconMap = {
  success: CheckCircle2,
  failed: AlertCircle,
  retrying: Loader2,
};

const statusColorMap = {
  success: "text-success bg-success/10",
  failed: "text-destructive bg-destructive/10",
  retrying: "text-warning bg-warning/10",
};

export function WebhookAttemptTimeline({ attempts, className }: WebhookAttemptTimelineProps) {
  if (!attempts.length) {
    return (
      <div className={cn("rounded-lg border border-white/10 bg-black/20 p-4", className)}>
        <p className="text-sm text-muted-foreground">No delivery attempts yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-foreground">Attempt Timeline</p>

      <div className="space-y-4">
        {attempts.map((attempt, index) => {
          const Icon = statusIconMap[attempt.status];
          const isLast = index === attempts.length - 1;

          return (
            <div key={attempt.id} className="relative flex gap-4">
              {!isLast && (
                <div className="absolute bottom-0 left-4 top-8 w-0.5 bg-white/10" />
              )}

              <div className={cn("relative z-10 rounded-full p-2", statusColorMap[attempt.status])}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Attempt #{attempt.attemptNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(attempt.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {attempt.httpStatus && (
                    <span className="inline-flex rounded bg-white/[0.06] px-2 py-1 text-xs text-muted-foreground">
                      HTTP {attempt.httpStatus}
                    </span>
                  )}
                  {attempt.responseTime && (
                    <span className="inline-flex rounded bg-white/[0.06] px-2 py-1 text-xs text-muted-foreground">
                      {attempt.responseTime}ms
                    </span>
                  )}
                </div>

                {attempt.errorMessage && (
                  <p className="text-xs text-destructive">{attempt.errorMessage}</p>
                )}

                {attempt.nextRetryTime && (
                  <p className="text-xs text-warning">
                    Next retry: {new Date(attempt.nextRetryTime).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

