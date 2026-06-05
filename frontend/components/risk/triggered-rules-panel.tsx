import { Gavel, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriggeredRiskRule } from "@/lib/types";
import { RiskLevelBadge } from "@/components/risk/risk-level-badge";

function formatRelative(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function TriggeredRulesPanel({ rules }: { rules: TriggeredRiskRule[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Gavel className="h-5 w-5 text-warning" />
              Top Triggered Rules
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Rule matches ranked by operational review pressure.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            aria-label="More risk rule actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-foreground">{rule.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {rule.description}
                </p>
              </div>
              <RiskLevelBadge level={rule.severity} className="shrink-0" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                <span className="font-mono text-foreground">{rule.matches.toLocaleString()}</span> matches
              </span>
              <span>Last triggered {formatRelative(rule.lastTriggeredAt)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

