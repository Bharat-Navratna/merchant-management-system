import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskDistributionBucket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { riskDotClass, riskLevelClass } from "@/components/risk/risk-level-badge";

function TrendIcon({ trend }: { trend: RiskDistributionBucket["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5" />;
  return <ArrowRight className="h-3.5 w-3.5" />;
}

export function RiskDistributionPanel({
  distribution,
}: {
  distribution: RiskDistributionBucket[];
}) {
  const total = distribution.reduce((sum, bucket) => sum + bucket.count, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-5 w-5 text-tertiary" />
              Entity Risk Distribution
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Live portfolio segmentation by risk tier and review pressure.
            </p>
          </div>
          <p className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
            {total.toLocaleString()} entities
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="overflow-hidden rounded-full border border-white/10 bg-black/25 p-1">
          <div className="flex h-4 overflow-hidden rounded-full">
            {distribution.map((bucket) => (
              <div
                key={bucket.level}
                className={cn("min-w-1", riskDotClass(bucket.level))}
                style={{ width: `${bucket.percentage}%` }}
                title={`${bucket.label}: ${bucket.percentage}%`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {distribution.map((bucket) => (
            <div
              key={bucket.level}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{bucket.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {bucket.count.toLocaleString()} merchants
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-1 font-mono text-xs",
                    riskLevelClass(bucket.level),
                  )}
                >
                  {bucket.percentage}%
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-16 flex-1 rounded-lg bg-black/20 p-2">
                  <div className="flex h-full items-end gap-1">
                    {[0.55, 0.8, 1, 0.7, 0.45, 0.6].map((scale, index) => (
                      <span
                        key={`${bucket.level}-${index}`}
                        className={cn("w-full rounded-t-sm opacity-80", riskDotClass(bucket.level))}
                        style={{ height: `${Math.max(18, bucket.percentage * scale)}%` }}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs",
                    bucket.trend === "up"
                      ? "bg-destructive/10 text-destructive"
                      : bucket.trend === "down"
                        ? "bg-success/10 text-success"
                        : "bg-white/[0.05] text-muted-foreground",
                  )}
                >
                  <TrendIcon trend={bucket.trend} />
                  {bucket.trendLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

