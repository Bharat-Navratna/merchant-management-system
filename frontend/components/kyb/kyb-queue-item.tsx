import { FileText, AlertTriangle, ShieldCheck, ShieldAlert, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { KybQueueEntry } from "@/lib/types";
import { KybSlaBadge } from "@/components/kyb/kyb-sla-badge";


const RISK_CONFIG = {
  low: {
    icon: ShieldCheck,
    label: "Low Risk",
    cls: "text-tertiary",
  },
  medium: {
    icon: ShieldAlert,
    label: "Med Risk",
    cls: "text-yellow-300",
  },
  high: {
    icon: AlertTriangle,
    label: "High Risk",
    cls: "text-orange-300",
  },
  critical: {
    icon: Flame,
    label: "Critical",
    cls: "text-destructive",
  },
};

const PRIORITY_DOT: Record<KybQueueEntry["priority"], string> = {
  urgent: "bg-destructive animate-pulse",
  high: "bg-orange-400",
  normal: "bg-white/30",
  low: "bg-white/15",
};

const STATUS_LABEL: Record<KybQueueEntry["status"], string> = {
  pending: "Pending",
  under_review: "In Review",
  escalated: "Escalated",
};


interface KybQueueItemProps {
  entry: KybQueueEntry;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function KybQueueItem({ entry, isSelected, onSelect }: KybQueueItemProps) {
  const risk = RISK_CONFIG[entry.riskLevel];
  const RiskIcon = risk.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className={cn(
        "w-full text-left px-4 py-3.5 border-b border-white/[0.05] transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
        isSelected
          ? "bg-primary/8 border-l-[3px] border-l-primary shadow-[inset_0_0_20px_rgba(173,198,255,0.04)]"
          : "border-l-[3px] border-l-transparent hover:bg-white/[0.04]",
      )}
      aria-pressed={isSelected}
      aria-label={`Select ${entry.merchantName} for review`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "size-1.5 rounded-full shrink-0 relative",
              PRIORITY_DOT[entry.priority],
            )}
            aria-hidden="true"
          />
          <h3
            className={cn(
              "text-sm font-semibold leading-tight break-words",
              isSelected ? "text-primary" : "text-foreground",
            )}
          >
            {entry.merchantName}
          </h3>
        </div>
        <KybSlaBadge deadlineIso={entry.slaDeadlineIso} className="shrink-0" />
      </div>

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground pl-3.5 mb-2">
        <span className="flex items-center gap-1">
          <FileText className="size-3" />
          {entry.submittedDocCount}/{entry.totalDocCount} docs
        </span>
        <span className={cn("flex items-center gap-1", risk.cls)}>
          <RiskIcon className="size-3" />
          {risk.label}
        </span>
        <span className="text-muted-foreground/50">{STATUS_LABEL[entry.status]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 pl-3.5">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] uppercase tracking-widest font-semibold bg-white/[0.05] border border-white/10 px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

