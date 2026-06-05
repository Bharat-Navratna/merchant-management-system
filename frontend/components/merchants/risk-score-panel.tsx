import { ShieldAlert, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MerchantRiskDetail } from "@/lib/types";
import { cn } from "@/lib/utils";


const LEVEL_CONFIG = {
  low: {
    scoreColor: "text-emerald-300",
    trackColor: "bg-emerald-400",
    bg: "from-emerald-500/5",
    border: "",
    label: "Low Risk",
    labelCls: "text-emerald-300",
  },
  medium: {
    scoreColor: "text-yellow-300",
    trackColor: "bg-yellow-400",
    bg: "from-yellow-500/5",
    border: "",
    label: "Medium Risk",
    labelCls: "text-yellow-300",
  },
  high: {
    scoreColor: "text-orange-300",
    trackColor: "bg-orange-400",
    bg: "from-orange-500/5",
    border: "shadow-[0_0_20px_rgba(249,115,22,0.08)]",
    label: "High Risk",
    labelCls: "text-orange-300",
  },
  critical: {
    scoreColor: "text-destructive",
    trackColor: "bg-destructive",
    bg: "from-destructive/8",
    border: "shadow-[0_0_20px_rgba(255,180,171,0.12)]",
    label: "Critical Risk",
    labelCls: "text-destructive",
  },
};

const SEVERITY_ICON_CLS = {
  high: "text-destructive",
  medium: "text-yellow-400",
  low: "text-muted-foreground",
};


interface RiskScorePanelProps {
  risk: MerchantRiskDetail;
}

export function RiskScorePanel({ risk }: RiskScorePanelProps) {
  const cfg = LEVEL_CONFIG[risk.level];
  const pct = Math.min(100, risk.score);

  return (
    <Card className={cn("relative overflow-hidden", cfg.border)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-linear-to-br to-transparent pointer-events-none",
          cfg.bg,
        )}
      />

      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShieldAlert className="size-4 text-primary" />
            Risk Intelligence
          </CardTitle>

          <div className="text-right">
            <span className={cn("text-3xl font-bold tabular-nums leading-none", cfg.scoreColor)}>
              {risk.score}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className={cn("font-semibold", cfg.labelCls)}>{cfg.label}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", cfg.trackColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-0 space-y-5">
        <div className="p-3.5 bg-black/25 rounded-lg border border-white/8">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="size-3 text-primary" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
              AI Summary
            </p>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">{risk.aiSummary}</p>
          <p className="text-[10px] text-muted-foreground mt-2 italic">
            Reviewer assistance only - not an automatic decision.
          </p>
        </div>

        {risk.triggeredRules.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Triggered Rules
            </p>
            <ul className="space-y-2">
              {risk.triggeredRules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-white/4 border border-white/6"
                >
                  <AlertTriangle
                    className={cn(
                      "size-4 shrink-0 mt-0.5",
                      SEVERITY_ICON_CLS[rule.severity],
                    )}
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{rule.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {risk.reasons.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Risk Factors
            </p>
            <ul className="space-y-1">
              {risk.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                  <span className="size-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 rounded-lg border border-white/8 bg-white/3">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1.5">
            Suggested Reviewer Action
          </p>
          <div className="flex items-start gap-2">
            <ArrowRight className="size-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/80 leading-relaxed">{risk.suggestedAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

