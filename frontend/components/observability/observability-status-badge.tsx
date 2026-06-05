import { ObservabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ObservabilityStatus, string> = {
  healthy: "border-success/25 bg-success/10 text-success",
  degraded: "border-warning/25 bg-warning/10 text-warning",
  incident: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function statusDotClass(status: ObservabilityStatus) {
  if (status === "healthy") return "bg-success";
  if (status === "degraded") return "bg-warning";
  return "bg-destructive";
}

export function ObservabilityStatusBadge({
  status,
  className,
}: {
  status: ObservabilityStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClass(status))} />
      {status}
    </span>
  );
}

