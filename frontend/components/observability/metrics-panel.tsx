import { LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricPanelData } from "@/lib/types";
import { ObservabilityStatusBadge, statusDotClass } from "@/components/observability/observability-status-badge";
import { cn } from "@/lib/utils";

function sparkline(points: number[]) {
  const width = 220;
  const height = 72;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function MetricsPanel({ metrics }: { metrics: MetricPanelData[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <LineChart className="h-5 w-5 text-primary" />
          Metrics Panels
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Lightweight trend visuals without a heavy chart dependency.
        </p>
      </CardHeader>
      <CardContent className="grid items-start gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold">{metric.title}</p>
                <p className="mt-2">
                  <span className="font-mono text-3xl text-foreground">{metric.value}</span>
                  {metric.unit && (
                    <span className="ml-2 text-xs text-muted-foreground">{metric.unit}</span>
                  )}
                </p>
              </div>
              <ObservabilityStatusBadge status={metric.status} className="shrink-0" />
            </div>

            <div className="mt-4 h-20 overflow-hidden rounded-lg border border-white/10 bg-black/25 p-3">
              <svg viewBox="0 0 220 72" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`metric-${metric.id}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgb(76 215 246)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="rgb(173 198 255)" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <polyline
                  points={sparkline(metric.points)}
                  fill="none"
                  stroke={`url(#metric-${metric.id})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{metric.trendLabel}</span>
              <span className={cn("h-2 w-2 rounded-full", statusDotClass(metric.status))} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

