"use client";

import { useQuery } from "@tanstack/react-query";
import { ScanLine, Settings2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AiRiskSummaryCard } from "@/components/risk/ai-risk-summary-card";
import { RiskDistributionPanel } from "@/components/risk/risk-distribution-panel";
import { RiskNetworkPanel } from "@/components/risk/risk-network-panel";
import { RiskSummaryCards } from "@/components/risk/risk-summary-cards";
import { RiskTable } from "@/components/risk/risk-table";
import { RiskTimeline } from "@/components/risk/risk-timeline";
import { TriggeredRulesPanel } from "@/components/risk/triggered-rules-panel";
import { WatchlistMerchantsPanel } from "@/components/risk/watchlist-merchants-panel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";

function RiskPageSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-5">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function RiskPage() {
  const riskQuery = useQuery({
    queryKey: ["risk-overview"],
    queryFn: api.getRiskOverview,
  });

  if (riskQuery.isLoading) {
    return <RiskPageSkeleton />;
  }

  if (riskQuery.isError || !riskQuery.data) {
    return (
      <EmptyState
        title="Unable to load risk intelligence"
        description="Risk signals could not be loaded. Please try again shortly."
      />
    );
  }

  const risk = riskQuery.data;
  const hasRiskData =
    risk.distribution.length > 0 ||
    risk.tableRows.length > 0 ||
    risk.triggeredRules.length > 0 ||
    risk.watchlist.length > 0;

  if (!hasRiskData) {
    return (
      <EmptyState
        title="No risk intelligence available"
        description="Risk signals, rule triggers, and watchlist matches will appear here once the rule engine emits events."
      />
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <ShieldAlert className="h-3.5 w-3.5" />
            Elevated review pressure - manual decisions required
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Risk Intelligence</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Monitor merchant risk signals, watchlist activity, rule triggers, and AI-assisted review insights.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info("Rule configuration is not connected in this preview.")}
          >
            <Settings2 className="h-4 w-4" />
            Configure Rules
          </Button>
          <Button onClick={() => toast.success("Risk scan queued for reviewer preview.")}>
            <ScanLine className="h-4 w-4" />
            Run Risk Scan
          </Button>
        </div>
      </header>

      <RiskSummaryCards stats={risk.stats} />

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-w-0 space-y-5">
          <RiskDistributionPanel distribution={risk.distribution} />
          <RiskNetworkPanel network={risk.network} />
          <RiskTable rows={risk.tableRows} />
        </div>

        <aside className="min-w-0 space-y-5">
          <AiRiskSummaryCard summary={risk.aiSummary} />
          <TriggeredRulesPanel rules={risk.triggeredRules} />
          <WatchlistMerchantsPanel merchants={risk.watchlist} />
          <RiskTimeline events={risk.timeline} />
        </aside>
      </div>
    </div>
  );
}

