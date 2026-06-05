import {
  History,
  ArrowRightLeft,
  FileText,
  ShieldAlert,
  Settings,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

const TYPE_CONFIG = {
  status_change: {
    icon: ArrowRightLeft,
    dotCls: "bg-primary ring-primary/20",
  },
  document: {
    icon: FileText,
    dotCls: "bg-secondary ring-secondary/20",
  },
  risk: {
    icon: ShieldAlert,
    dotCls: "bg-destructive ring-destructive/20",
  },
  system: {
    icon: Settings,
    dotCls: "bg-white/20 ring-white/10",
  },
  note: {
    icon: MessageSquare,
    dotCls: "bg-tertiary ring-tertiary/20",
  },
};

interface StatusTimelineProps {
  events: TimelineEvent[];
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <History className="size-4 text-primary" />
            Status Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No events recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <History className="size-4 text-primary" />
          Status Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        <ol
          className="relative space-y-4 pl-6 before:absolute before:left-[11px] before:bottom-2 before:top-2 before:w-px before:bg-white/10"
          aria-label="Merchant lifecycle events"
        >
          {events.map((event, idx) => {
            const cfg = TYPE_CONFIG[event.type];
            const Icon = cfg.icon;
            const isFirst = idx === 0;

            return (
              <li key={event.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[21px] top-1.5 size-3 rounded-full ring-4",
                    cfg.dotCls,
                    isFirst && "size-3.5 -left-[22px]",
                  )}
                />

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 text-muted-foreground shrink-0" />
                      <p className="break-words text-sm font-semibold text-foreground">
                        {event.label}
                      </p>
                    </div>
                    <time className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                      {formatTimestamp(event.timestamp)}
                    </time>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                    {event.description}
                  </p>

                  {event.fromStatus && event.toStatus && (
                    <p className="text-[11px] text-muted-foreground pl-5">
                      <span className="font-medium text-foreground/60">{event.fromStatus}</span>
                      {" → "}
                      <span className="font-semibold text-foreground/80">{event.toStatus}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 pl-5">
                    {event.actor && (
                      <span className="text-[11px] text-muted-foreground">
                        By{" "}
                        <span className="text-foreground/70 font-medium">
                          {event.actor}
                        </span>
                      </span>
                    )}
                    {event.reason && (
                      <span className="text-[11px] text-muted-foreground italic">
                        Reason: {event.reason}
                      </span>
                    )}
                  </div>

                  {event.requestId && (
                    <p className="pl-5">
                      <code className="inline-block max-w-full truncate rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60" title={event.requestId}>
                        {event.requestId}
                      </code>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

