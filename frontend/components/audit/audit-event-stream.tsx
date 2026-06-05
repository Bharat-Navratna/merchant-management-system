import { FileCheck2, History, KeyRound, LogIn, RotateCcw, ShieldAlert, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditEventStreamItem } from "@/lib/types";
import { AuditSeverityBadge } from "@/components/audit/audit-severity-badge";

const streamIcons = {
  login: LogIn,
  status_change: FileCheck2,
  document_verification: ShieldAlert,
  webhook_replay: RotateCcw,
  role_change: UserCog,
  failed_login: KeyRound,
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AuditEventStream({ stream }: { stream: AuditEventStreamItem[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5 text-tertiary" />
          Recent Audit Stream
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compact feed of login, KYB, webhook, and role events.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {stream.map((item) => {
          const Icon = streamIcons[item.type];

          return (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 break-words text-xs text-muted-foreground">{item.actor}</p>
                  </div>
                </div>
                <AuditSeverityBadge severity={item.severity} className="shrink-0" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <time>{formatTime(item.timestamp)}</time>
                <code className="max-w-full truncate font-mono text-tertiary" title={item.requestId}>{item.requestId}</code>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

