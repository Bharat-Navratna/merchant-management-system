"use client";

import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskTableMerchant } from "@/lib/types";
import { RiskLevelBadge, riskDotClass } from "@/components/risk/risk-level-badge";
import { cn } from "@/lib/utils";

const statusLabels: Record<RiskTableMerchant["status"], string> = {
  open: "Open",
  under_review: "Under Review",
  watchlisted: "Watchlisted",
  cleared: "Cleared",
  escalated: "Escalated",
};

const statusStyles: Record<RiskTableMerchant["status"], string> = {
  open: "border-primary/25 bg-primary/10 text-primary",
  under_review: "border-secondary/25 bg-secondary/10 text-secondary",
  watchlisted: "border-warning/25 bg-warning/10 text-warning",
  cleared: "border-success/25 bg-success/10 text-success",
  escalated: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreBar({ score, level }: { score: number; level: RiskTableMerchant["riskLevel"] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 rounded border border-white/10 bg-black/25 px-1.5 py-1 text-center font-mono text-xs text-foreground">
        {score}
      </span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full", riskDotClass(level))} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function RiskTable({ rows }: { rows: RiskTableMerchant[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">Recent Risk Indicators</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Merchant-level review state, triggered rules, and reviewer ownership.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Risk CSV export queued for preview.")}>
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Bulk risk actions are not connected in this preview.")}>
              Bulk Action
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium">No risk rows to review</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Risk indicators will appear once rules or watchlist matches are detected.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1120px] text-sm">
                <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Merchant</th>
                    <th className="px-5 py-4 font-semibold">Risk Score</th>
                    <th className="px-5 py-4 font-semibold">Level</th>
                    <th className="px-5 py-4 font-semibold">Triggered Rules</th>
                    <th className="px-5 py-4 font-semibold">Last Reviewed</th>
                    <th className="px-5 py-4 font-semibold">Reviewer</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.04]">
                      <td className="max-w-[230px] px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] font-semibold text-primary">
                            {row.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-foreground">{row.name}</p>
                            <p className="break-all text-xs text-muted-foreground" title={row.email}>{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <ScoreBar score={row.riskScore} level={row.riskLevel} />
                      </td>
                      <td className="px-5 py-4">
                        <RiskLevelBadge level={row.riskLevel} />
                      </td>
                      <td className="max-w-[280px] px-5 py-4">
                        {row.triggeredRules.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {row.triggeredRules.slice(0, 3).map((rule) => (
                              <span
                                key={rule}
                                className="rounded-full bg-white/[0.05] px-2 py-1 text-[11px] text-muted-foreground"
                              >
                                {rule}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">No triggers</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {formatTime(row.lastReviewedAt)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{row.reviewer}</td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                            statusStyles[row.status],
                          )}
                        >
                          {statusLabels[row.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Open actions for ${row.name}`}
                          onClick={() => toast.info(`Risk actions for ${row.name} are not connected in this preview.`)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 xl:hidden">
              {rows.map((row) => (
                <div key={row.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{row.name}</p>
                      <p className="break-all text-xs text-muted-foreground">{row.email}</p>
                    </div>
                    <RiskLevelBadge level={row.riskLevel} className="shrink-0" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <ScoreBar score={row.riskScore} level={row.riskLevel} />
                    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", statusStyles[row.status])}>
                      {statusLabels[row.status]}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {row.triggeredRules.length > 0 ? (
                      row.triggeredRules.map((rule) => (
                        <span key={rule} className="rounded-full bg-white/[0.05] px-2 py-1 text-[11px] text-muted-foreground">
                          {rule}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No triggers</span>
                    )}
                  </div>
                  <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
                    <span>Reviewer: {row.reviewer}</span>
                    <span>Last reviewed: {formatTime(row.lastReviewedAt)}</span>
                    <code className="break-all font-mono text-tertiary" title={row.id}>{row.id}</code>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

