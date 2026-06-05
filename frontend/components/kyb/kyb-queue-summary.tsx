import {
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KybQueueStats } from "@/lib/types";

interface StatCard {
  key: keyof KybQueueStats;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "primary" | "danger" | "success" | "destructive" | "warning";
  trackPct: number;
}

const CARDS: StatCard[] = [
  {
    key: "awaitingReview",
    label: "Awaiting Review",
    icon: ClipboardList,
    variant: "primary",
    trackPct: 65,
  },
  {
    key: "slaBreachingSoon",
    label: "SLA Breaching Soon",
    icon: AlertTriangle,
    variant: "danger",
    trackPct: 25,
  },
  {
    key: "approvedToday",
    label: "Approved Today",
    icon: CheckCircle2,
    variant: "success",
    trackPct: 80,
  },
  {
    key: "rejectedToday",
    label: "Rejected Today",
    icon: XCircle,
    variant: "destructive",
    trackPct: 15,
  },
  {
    key: "resubmissionRequired",
    label: "Resubmission Required",
    icon: RotateCcw,
    variant: "warning",
    trackPct: 30,
  },
];

const VARIANT_STYLES = {
  primary: {
    glow: "bg-primary/5",
    value: "text-foreground",
    track: "bg-primary",
    badge: "bg-primary/15 text-primary border-primary/20",
    icon: "text-primary",
  },
  danger: {
    glow: "bg-destructive/5",
    value: "text-destructive",
    track: "bg-destructive",
    badge: "bg-destructive/15 text-destructive border-destructive/25 shadow-[0_0_12px_rgba(255,180,171,0.15)]",
    icon: "text-destructive",
  },
  success: {
    glow: "bg-emerald-500/5",
    value: "text-foreground",
    track: "bg-tertiary",
    badge: "bg-tertiary/15 text-tertiary border-tertiary/20",
    icon: "text-tertiary",
  },
  destructive: {
    glow: "bg-orange-500/5",
    value: "text-foreground",
    track: "bg-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/20",
    icon: "text-orange-400",
  },
  warning: {
    glow: "bg-secondary/5",
    value: "text-foreground",
    track: "bg-secondary",
    badge: "bg-secondary/15 text-secondary border-secondary/20",
    icon: "text-secondary",
  },
};

interface KybQueueSummaryProps {
  stats: KybQueueStats;
  className?: string;
}

export function KybQueueSummary({ stats, className }: KybQueueSummaryProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4", className)}>
      {CARDS.map(({ key, label, icon: Icon, variant, trackPct }) => {
        const s = VARIANT_STYLES[variant];
        const value = stats[key];

        return (
          <div
            key={key}
            className="glass-panel rounded-xl p-4 relative overflow-hidden"
          >
            <div
              className={cn(
                "absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none",
                s.glow,
              )}
            />

            <div className="relative">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                {label}
              </p>

              <div className="flex items-end justify-between mb-3">
                <span className={cn("text-3xl font-bold tabular-nums leading-none", s.value)}>
                  {String(value).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border",
                    s.badge,
                  )}
                >
                  <Icon className={cn("size-3", s.icon)} />
                  {variant === "danger" ? "Critical" : variant === "success" ? "On Track" : "Total"}
                </span>
              </div>

              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", s.track)}
                  style={{ width: `${trackPct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

