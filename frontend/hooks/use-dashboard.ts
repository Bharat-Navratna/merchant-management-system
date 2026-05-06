"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/services";

export function useDashboardData() {
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
  });

  const activityQuery = useQuery({
    queryKey: ["activities"],
    queryFn: api.getActivities,
  });

  return { statsQuery, activityQuery };
}
