import type { ComponentType } from "react";
import { Activity, GitBranch, History, RotateCcw, UserCheck, Watch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskTimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeConfig: Record<RiskTimelineEvent["type"], {
  label: string;
  icon: ComponentType<{ className?: string }>;
  className: string;
}> = {
  rule_triggered: {
    label: "Rule",
    icon: Activity,
    className: "bg-destructive text-destructive",
  },
  reviewer_assigned: {
    label: "Reviewer",
    icon: UserCheck,
    className: "bg-tertiary text-tertiary",
  },
  score_changed: {
    label: "Score",
    icon: GitBranch,
    className: "bg-warning text-warning",
  },
  watchlist_added: {
    label: "Watchlist",
    icon: Watch,
    className: "bg-secondary text-secondary",
  },
  manual_override: {
    label: "Override",
    icon: RotateCcw,
    className: "bg-success text-success",
  },
};

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RiskTimeline({ events }: { events: RiskTimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5 text-primary" />
          Risk Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recent rule triggers, reviewer actions, score updates, and overrides.
        </p>
      </CardHeader>
      <CardContent className="p-5">
        {events.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-medium">No recent risk events</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Timeline entries will appear as rules and reviewers update merchant risk.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-[10px] before:top-2 before:w-px before:bg-white/10">
            {events.map((event) => {
              const config = typeConfig[event.type];
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
                        <p className="break-words text-sm font-semibold text-foreground">{event.label}</p>
                        <p className="mt-1 break-words text-xs text-muted-foreground">{event.merchantName}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-muted-foreground">
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <time>{formatTime(event.timestamp)}</time>
                      <code className="max-w-full truncate font-mono text-primary" title={event.eventId}>{event.eventId}</code>
                      <code className="max-w-full truncate font-mono text-tertiary" title={event.requestId}>{event.requestId}</code>
                    </div>
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

