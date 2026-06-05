"use client";

import { SearchCode, Siren } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HealthChecksPanel } from "@/components/observability/health-checks-panel";
import { IncidentAlertsPanel } from "@/components/observability/incident-alerts-panel";
import { MetricsPanel } from "@/components/observability/metrics-panel";
import { ObservabilitySummaryCards } from "@/components/observability/observability-summary-cards";
import { SystemHealthTimeline } from "@/components/observability/system-health-timeline";
import { TraceLookupPanel } from "@/components/observability/trace-lookup-panel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";

function ObservabilitySkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <Skeleton className="h-72 w-full rounded-xl" />
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

export default function ObservabilityPage() {
  const observabilityQuery = useQuery({
    queryKey: ["observability-data"],
    queryFn: api.getObservabilityData,
  });

  if (observabilityQuery.isLoading) {
    return <ObservabilitySkeleton />;
  }

  if (observabilityQuery.isError || !observabilityQuery.data) {
    return (
      <EmptyState
        title="Unable to load observability metrics"
        description="Platform telemetry could not be loaded. Please try again shortly."
      />
    );
  }

  const data = observabilityQuery.data;
  const hasTelemetry =
    data.healthChecks.length > 0 ||
    data.metrics.length > 0 ||
    data.incidents.length > 0 ||
    data.traces.length > 0 ||
    data.timeline.length > 0;

  if (!hasTelemetry) {
    return (
      <EmptyState
        title="No observability data available"
        description="Health checks, traces, incidents, and metrics will appear here once telemetry is emitted."
      />
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-tertiary/25 bg-tertiary/10 px-3 py-1 text-xs font-semibold text-tertiary">
            <Siren className="h-3.5 w-3.5" />
            Platform reliability command center
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Observability</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Monitor API latency, worker health, webhook queue depth, database status, and platform reliability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info("Trace lookup is available in the panel below.")}
          >
            <SearchCode className="h-4 w-4" />
            Trace Lookup
          </Button>
          <Button onClick={() => toast.info("Incident details are not connected in this preview.")}>
            <Siren className="h-4 w-4" />
            View Incidents
          </Button>
        </div>
      </header>

      <ObservabilitySummaryCards stats={data.stats} />

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-5">
          <HealthChecksPanel checks={data.healthChecks} />
          <MetricsPanel metrics={data.metrics} />
          <SystemHealthTimeline events={data.timeline} />
        </div>

        <aside className="min-w-0 space-y-5">
          <IncidentAlertsPanel incidents={data.incidents} />
          <TraceLookupPanel traces={data.traces} />
        </aside>
      </div>
    </div>
  );
}

