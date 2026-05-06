"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/error";

export default function KybPage() {
  const queryClient = useQueryClient();
  const merchantsQuery = useQuery({ queryKey: ["merchants"], queryFn: api.getMerchants });
  const selectedMerchantId = merchantsQuery.data?.[0]?.id;
  const docsQuery = useQuery({
    queryKey: ["kyb-docs", selectedMerchantId],
    queryFn: () => api.getKybDocuments(selectedMerchantId as string),
    enabled: Boolean(selectedMerchantId),
  });
  const approveMutation = useMutation({
    mutationFn: () => api.updateMerchantStatus(selectedMerchantId as string, "ACTIVE", "KYB approved"),
    onSuccess: () => {
      toast.success("Merchant approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Approval failed.")),
  });
  const allVerified = useMemo(
    () => docsQuery.data?.every((doc) => doc.status === "verified") ?? false,
    [docsQuery.data],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">KYB Panel</h2>
        <p className="text-sm text-muted-foreground">Verify required business documents before approval.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docsQuery.data?.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <p className="text-sm">{doc.name}</p>
              <StatusPill status={doc.status} />
            </div>
          ))}
          <div className="pt-2">
            <Button disabled={!allVerified || !selectedMerchantId} onClick={() => approveMutation.mutate()}>
              Approve Merchant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
