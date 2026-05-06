"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/error";

const kybSteps = ["Pending", "Under Review", "Approved / Rejected"];

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const merchantQuery = useQuery({ queryKey: ["merchant", id], queryFn: () => api.getMerchantById(id) });
  const docsQuery = useQuery({ queryKey: ["kyb-docs", id], queryFn: () => api.getKybDocuments(id) });
  const statusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: "ACTIVE" | "SUSPENDED"; reason: string }) =>
      api.updateMerchantStatus(id, status, reason),
    onSuccess: () => {
      toast.success("Merchant status updated.");
      queryClient.invalidateQueries({ queryKey: ["merchant", id] });
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update status."));
    },
  });

  const activeStep = useMemo(() => {
    const status = merchantQuery.data?.kybStatus;
    if (status === "pending") return 0;
    if (status === "under review") return 1;
    return 2;
  }, [merchantQuery.data?.kybStatus]);

  if (merchantQuery.isLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  if (!merchantQuery.data) {
    return <EmptyState title="Merchant not found" description="Please select a valid merchant." />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{merchantQuery.data.name}</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Merchant Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>Email: {merchantQuery.data.email}</p>
            <p>Country: {merchantQuery.data.country}</p>
            <p>Created: {merchantQuery.data.createdAt}</p>
            <div className="pt-1"><StatusPill status={merchantQuery.data.status} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() => statusMutation.mutate({ status: "ACTIVE", reason: "Approved by operator" })}
            >
              Approve
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => statusMutation.mutate({ status: "SUSPENDED", reason: "Rejected during KYB review" })}
            >
              Reject
            </Button>
            <Button className="w-full" variant="outline">Request Info</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>KYB Status Tracker</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          {kybSteps.map((step, index) => (
            <div key={step} className={`rounded-lg border p-3 ${index <= activeStep ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {docsQuery.data?.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
              <p className="text-sm">{doc.name}</p>
              <StatusPill status={doc.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>KYB submitted by merchant.</p>
          <p>Risk review initiated.</p>
          <p>Awaiting final document verification.</p>
        </CardContent>
      </Card>
    </div>
  );
}
