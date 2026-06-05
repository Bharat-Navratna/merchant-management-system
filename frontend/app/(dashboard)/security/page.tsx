"use client";

import { Bell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ActiveSessionsPanel } from "@/components/security/active-sessions-panel";
import { RoleDistributionPanel } from "@/components/security/role-distribution-panel";
import { SecurityEventsStream } from "@/components/security/security-events-stream";
import { SecurityPostureChecklist } from "@/components/security/security-posture-checklist";
import { SecuritySummaryCards } from "@/components/security/security-summary-cards";
import { SuspiciousActivityPanel } from "@/components/security/suspicious-activity-panel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";

function SecurityPageSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Skeleton className="h-120 w-full rounded-xl" />
        <div className="space-y-5">
          <Skeleton className="h-70 w-full rounded-xl" />
          <Skeleton className="h-95 w-full rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-105 w-full rounded-xl" />
    </div>
  );
}

export default function SecurityPage() {
  const securityQuery = useQuery({
    queryKey: ["security-data"],
    queryFn: api.getSecurityData,
  });

  if (securityQuery.isLoading) {
    return <SecurityPageSkeleton />;
  }

  if (securityQuery.isError || !securityQuery.data) {
    return (
      <EmptyState
        title="Unable to load security data"
        description="Platform security telemetry could not be loaded. Please try again shortly."
      />
    );
  }

  const data = securityQuery.data;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Live monitoring active
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Security</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Monitor operator sessions, login risk, access controls, and platform security posture.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info("Security policy details are not connected in this preview.")}
          >
            <ShieldCheck className="h-4 w-4" />
            Security Policy
          </Button>
          <Button onClick={() => toast.info("Security alerts review is not connected in this preview.")}>
            <Bell className="h-4 w-4" />
            Review Alerts
          </Button>
        </div>
      </header>

      <SecuritySummaryCards stats={data.stats} />

      <SuspiciousActivityPanel activities={data.suspiciousActivity} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ActiveSessionsPanel sessions={data.sessions} />

        <aside className="space-y-5">
          <RoleDistributionPanel roles={data.roleDistribution} />
          <SecurityEventsStream events={data.eventStream} />
        </aside>
      </div>

      <SecurityPostureChecklist items={data.postureChecklist} />
    </div>
  );
}

