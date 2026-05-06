"use client";

import { useDashboardData } from "@/hooks/use-dashboard";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";

export default function DashboardPage() {
  const { statsQuery, activityQuery } = useDashboardData();

  if (statsQuery.isLoading || activityQuery.isLoading) {
    return <Skeleton className="h-[360px] w-full" />;
  }

  if (statsQuery.isError || activityQuery.isError || !statsQuery.data || !activityQuery.data) {
    return <EmptyState title="Unable to load dashboard" description="Try refreshing the page." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Operations overview for merchants and webhooks.</p>
      </div>

      <KpiCards stats={statsQuery.data} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Delivery Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Successful deliveries</span>
              <span className="font-semibold text-green-600">{statsQuery.data.webhookSuccess}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Failed deliveries</span>
              <span className="font-semibold text-red-600">{statsQuery.data.webhookFailed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityQuery.data.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                <div>
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.actor}</p>
                </div>
                <StatusPill status="success" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
