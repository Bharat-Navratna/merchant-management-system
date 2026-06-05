import { ClipboardCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiRiskSummary } from "@/lib/types";

export function AiRiskSummaryCard({ summary }: { summary: AiRiskSummary }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <CardTitle className="text-xl">AI-Assisted Risk Summary</CardTitle>
            <p className="mt-1 text-xs font-semibold uppercase text-primary">
              Reviewer decision required
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{summary.summary}</p>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Risk factors detected</p>
          <div className="flex flex-wrap gap-2">
            {summary.factors.map((factor) => (
              <span
                key={factor}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-foreground"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Suggested reviewer action
              </p>
              <p className="mt-1 text-sm text-foreground">{summary.suggestedAction}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold uppercase text-muted-foreground">Confidence</span>
            <span className="font-mono text-primary">{summary.confidence}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-primary shadow-[0_0_18px_rgba(173,198,255,0.35)]"
              style={{ width: `${summary.confidence}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

