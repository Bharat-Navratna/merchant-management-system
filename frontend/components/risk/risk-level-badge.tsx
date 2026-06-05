import { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const levelStyles: Record<RiskLevel, string> = {
  low: "border-success/25 bg-success/10 text-success",
  medium: "border-primary/25 bg-primary/10 text-primary",
  high: "border-warning/30 bg-warning/10 text-warning",
  critical: "border-destructive/35 bg-destructive/15 text-destructive",
};

export function riskLevelClass(level: RiskLevel) {
  return levelStyles[level];
}

export function riskDotClass(level: RiskLevel) {
  if (level === "low") return "bg-success";
  if (level === "medium") return "bg-primary";
  if (level === "high") return "bg-warning";
  return "bg-destructive";
}

export function RiskLevelBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        levelStyles[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", riskDotClass(level))} />
      {level}
    </span>
  );
}

