"use client";

import { useQuery } from "@tanstack/react-query";
import { CommandCenterDashboard } from "@/components/dashboard/command-center-dashboard";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";

export default function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["command-center-dashboard"],
    queryFn: api.getCommandCenterDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <EmptyState title="Unable to load dashboard" description="Try refreshing the page." />;
  }

  return <CommandCenterDashboard data={dashboardQuery.data} />;
}

