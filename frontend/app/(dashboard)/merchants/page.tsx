"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { MerchantsTable } from "@/components/merchants/merchants-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function MerchantsPage() {
  const merchantsQuery = useQuery({
    queryKey: ["merchants"],
    queryFn: api.getMerchants,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Merchants</h2>
        <p className="text-sm text-muted-foreground">Manage merchant accounts and KYB progress.</p>
      </div>
      {merchantsQuery.isLoading && <Skeleton className="h-[420px] w-full" />}
      {merchantsQuery.isError && <EmptyState title="Failed to load merchants" description="Please try again shortly." />}
      {merchantsQuery.data && <MerchantsTable data={merchantsQuery.data} />}
    </div>
  );
}
