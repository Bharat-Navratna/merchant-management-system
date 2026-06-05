import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type KybProgressProps = {
  verified?: number;
  required?: number;
  compact?: boolean;
};

export function KybProgress({ verified = 0, required = 3, compact = false }: KybProgressProps) {
  const safeRequired = Math.max(required, 1);
  const percent = Math.min(100, Math.round((verified / safeRequired) * 100));
  const complete = verified >= safeRequired;

  return (
    <div className={cn("min-w-0", compact ? "space-y-1.5" : "space-y-2")}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {verified}/{safeRequired} documents verified
        </span>
        {complete && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            complete ? "bg-success" : percent >= 50 ? "bg-primary" : "bg-warning",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

