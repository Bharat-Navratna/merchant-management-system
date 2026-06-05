"use client";

import { Eye, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WatchlistMerchant } from "@/lib/types";
import { RiskLevelBadge, riskDotClass } from "@/components/risk/risk-level-badge";
import { cn } from "@/lib/utils";

export function WatchlistMerchantsPanel({
  merchants,
}: {
  merchants: WatchlistMerchant[];
}) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Eye className="h-5 w-5 text-secondary" />
          Watchlist Merchants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Merchants with active matches requiring human review.
        </p>
      </CardHeader>
      <CardContent className="p-4">
        {merchants.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-medium">No watchlist matches</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New watchlist merchants will appear here when risk thresholds are crossed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", riskDotClass(merchant.riskLevel))} />
                      <p className="break-words font-semibold text-foreground">{merchant.name}</p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {merchant.triggerReason}
                    </p>
                  </div>
                  <RiskLevelBadge level={merchant.riskLevel} className="shrink-0" />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">Risk score</p>
                    <p className="font-mono text-2xl text-primary">{merchant.riskScore}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">Reviewer</p>
                    <p className="mt-1 flex items-center gap-2 break-words text-sm text-foreground">
                      <UserCheck className="h-3.5 w-3.5 text-tertiary" />
                      {merchant.assignedReviewer}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(`${merchant.action} is not connected in this preview.`)}
                  >
                    {merchant.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

