"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { MerchantsWorkspace } from "@/components/merchants/merchants-workspace";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function MerchantsPage() {
  const merchantsQuery = useQuery({
    queryKey: ["merchants"],
    queryFn: api.getMerchants,
  });

  return (
    <>
      {merchantsQuery.isLoading && <Skeleton className="h-96 w-full" />}
      {merchantsQuery.isError && (
        <EmptyState title="Failed to load merchants" description="Please try again shortly." />
      )}
      {merchantsQuery.data && <MerchantsWorkspace merchants={merchantsQuery.data} />}
    </>
  );
}

