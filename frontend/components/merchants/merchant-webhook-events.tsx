import Link from "next/link";
import { Webhook, ExternalLink, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MerchantWebhookEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const STATUS_CFG = {
  delivered: {
    icon: CheckCircle2,
    label: "200",
    cls: "bg-tertiary/15 text-tertiary border-tertiary/25",
  },
  failed: {
    icon: XCircle,
    label: "503",
    cls: "bg-destructive/15 text-destructive border-destructive/25",
  },
  retrying: {
    icon: RefreshCw,
    label: "RTY",
    cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  },
  pending: {
    icon: Clock,
    label: "PND",
    cls: "bg-white/5 text-muted-foreground border-white/10",
  },
};

interface MerchantWebhookEventsProps {
  events: MerchantWebhookEntry[];
  merchantId: string;
}

export function MerchantWebhookEvents({ events, merchantId }: MerchantWebhookEventsProps) {
  const isEmpty = events.length === 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Webhook className="size-4 text-tertiary" />
            Webhook Events
          </CardTitle>
          <Link
            href={`/webhooks?merchant=${merchantId}`}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="View all webhooks"
          >
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground py-2">No webhook events for this merchant.</p>
        ) : (
          <ul className="space-y-1">
            {events.map((ev) => {
              const cfg = STATUS_CFG[ev.deliveryStatus];
              const StatusIcon = cfg.icon;

              return (
                <li
                  key={ev.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0",
                        cfg.cls,
                      )}
                    >
                      {ev.httpStatus ?? cfg.label}
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted-foreground truncate max-w-[160px] sm:max-w-[220px]">
                        {ev.eventType}
                      </p>
                      <p className="max-w-[220px] break-words text-[10px] text-muted-foreground/50">
                        {ev.endpoint}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {ev.attempts > 1 && (
                      <span className="text-[10px] text-muted-foreground hidden group-hover:block">
                        {ev.attempts} attempts
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelative(ev.lastAttemptedAt)}
                    </span>
                    <StatusIcon className={cn("size-3.5", cfg.cls.split(" ")[2] ?? "text-muted-foreground")} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {events.length > 0 && (
          <p className="text-[10px] text-muted-foreground mt-3">
            Showing {events.length} most recent events -{" "}
            <Link
              href={`/webhooks?merchant=${merchantId}`}
              className="text-primary hover:underline"
            >
              View all
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

