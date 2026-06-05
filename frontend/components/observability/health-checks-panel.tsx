import { CheckCircle2, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthCheck } from "@/lib/types";
import { ObservabilityStatusBadge, statusDotClass } from "@/components/observability/observability-status-badge";
import { cn } from "@/lib/utils";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function HealthChecksPanel({ checks }: { checks: HealthCheck[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Server className="h-5 w-5 text-tertiary" />
          Health Checks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Synthetic probes across critical MerchantOps dependencies.
        </p>
      </CardHeader>
      <CardContent className="grid items-start gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {checks.map((check) => (
          <div key={check.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", statusDotClass(check.status))} />
                  <p className="break-words font-semibold">{check.component}</p>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {check.detail}
                </p>
              </div>
              <ObservabilityStatusBadge status={check.status} className="shrink-0" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {formatTime(check.lastCheckedAt)}
              </span>
              <code className="font-mono text-foreground">{check.latency}</code>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

