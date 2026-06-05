import type { ComponentType } from "react";
import {
  KeyRound,
  Lock,
  LogIn,
  RefreshCw,
  RotateCcw,
  ShieldOff,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityStreamEvent, SecurityEventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const eventConfig: Record<
  SecurityEventType,
  { icon: ComponentType<{ className?: string }>; label: string }
> = {
  login_success: { icon: LogIn, label: "Login" },
  failed_login: { icon: KeyRound, label: "Failed Login" },
  token_refresh: { icon: RefreshCw, label: "Token Refresh" },
  account_locked: { icon: Lock, label: "Account Locked" },
  role_changed: { icon: UserCog, label: "Role Changed" },
  webhook_secret_rotated: { icon: RotateCcw, label: "Secret Rotated" },
  session_revoked: { icon: ShieldOff, label: "Session Revoked" },
};

const severityStyles: Record<SecurityStreamEvent["severity"], string> = {
  low: "border-success/25 bg-success/10 text-success",
  medium: "border-warning/25 bg-warning/10 text-warning",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function SecurityEventsStream({ events }: { events: SecurityStreamEvent[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lock className="h-5 w-5 text-primary" />
          Recent Security Events
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Login activity, token refreshes, lockouts, role changes, and session events.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {events.map((event) => {
          const cfg = eventConfig[event.type];
          const Icon = cfg.icon;

          return (
            <div key={event.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-foreground">{event.label}</p>
                    <p className="mt-0.5 break-words text-xs text-muted-foreground">{event.actor}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                    severityStyles[event.severity],
                  )}
                >
                  {event.severity}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <time>{formatTime(event.timestamp)}</time>
                {event.ipAddress && (
                  <code className="font-mono text-foreground/60" title={event.ipAddress}>{event.ipAddress}</code>
                )}
                <code className="max-w-full truncate font-mono text-tertiary" title={event.requestId}>{event.requestId}</code>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

