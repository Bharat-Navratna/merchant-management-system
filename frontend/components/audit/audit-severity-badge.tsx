import { AuditLog } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityStyles: Record<AuditLog["severity"], string> = {
  low: "border-success/25 bg-success/10 text-success",
  medium: "border-warning/25 bg-warning/10 text-warning",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function AuditSeverityBadge({
  severity,
  className,
}: {
  severity: AuditLog["severity"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        severityStyles[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}

