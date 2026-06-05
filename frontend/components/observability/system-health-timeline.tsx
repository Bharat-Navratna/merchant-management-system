import type { ComponentType } from "react";
import { CloudUpload, History, RadioTower, RotateCcw, Timer, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealthTimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const timelineConfig: Record<SystemHealthTimelineEvent["type"], {
  label: string;
  icon: ComponentType<{ className?: string }>;
  className: string;
}> = {
  deployment: { label: "Deploy", icon: CloudUpload, className: "bg-primary text-primary" },
  latency_spike: { label: "Latency", icon: Timer, className: "bg-warning text-warning" },
  worker_delay: { label: "Worker", icon: RadioTower, className: "bg-secondary text-secondary" },
  retry_storm: { label: "Retry", icon: Waves, className: "bg-destructive text-destructive" },
  recovery: { label: "Recovery", icon: RotateCcw, className: "bg-success text-success" },
};

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SystemHealthTimeline({ events }: { events: SystemHealthTimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5 text-primary" />
          System Health Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deployments, latency spikes, worker delays, retry storms, and recovery events.
        </p>
      </CardHeader>
      <CardContent className="p-5">
        {events.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-medium">No system health events</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform events will appear here as monitors emit timeline updates.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-[10px] before:top-2 before:w-px before:bg-white/10">
            {events.map((event) => {
              const config = timelineConfig[event.type];
              const Icon = config.icon;

              return (
                <li key={event.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[21px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-opacity-15 ring-4 ring-background",
                      config.className,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold">{event.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-muted-foreground">
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                    {event.requestId && (
                      <code className="mt-3 block truncate font-mono text-xs text-tertiary" title={event.requestId}>
                        {event.requestId}
                      </code>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

