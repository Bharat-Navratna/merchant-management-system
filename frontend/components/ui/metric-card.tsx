import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  icon: ComponentType<{ className?: string }>;
  toneClass: string;
  className?: string;
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  toneClass,
  className,
}: MetricCardProps) {
  return (
    <Card density="compact" className={cn("min-w-0", className)}>
      <CardContent className="p-4">
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase leading-snug text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 break-words font-display text-2xl font-bold leading-tight text-foreground">
              {value}
            </p>
            {detail ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            ) : null}
          </div>
          <span className={cn("shrink-0 rounded-lg border p-1.5", toneClass)}>
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
