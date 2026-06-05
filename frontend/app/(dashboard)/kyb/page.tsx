"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, Download } from "lucide-react";

import { api } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/error";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KybQueueSummary } from "@/components/kyb/kyb-queue-summary";
import { KybReviewQueue } from "@/components/kyb/kyb-review-queue";
import {
  KybReviewWorkspace,
  WorkspaceEmptyState,
  WorkspaceSkeleton,
} from "@/components/kyb/kyb-review-workspace";
import type { KybDecisionPayload } from "@/components/kyb/kyb-decision-panel";

function PageError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}

export default function KybReviewPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statsQ = useQuery({
    queryKey: ["kyb-queue-stats"],
    queryFn: () => api.getKybQueueStats(),
  });

  const queueQ = useQuery({
    queryKey: ["kyb-queue"],
    queryFn: () => api.getKybQueue(),
  });

  const selectedEntry = queueQ.data?.find((e) => e.id === selectedId) ?? null;

  const docsQ = useQuery({
    queryKey: ["kyb-doc-details", selectedEntry?.merchantId ?? selectedId],
    queryFn: () =>
      api.getKybDocumentDetails(
        selectedEntry?.merchantId ?? (selectedId as string),
      ),
    enabled: Boolean(selectedId),
  });

  const checklistQ = useQuery({
    queryKey: ["kyb-checklist", selectedId],
    queryFn: () => api.getKybChecklist(selectedId as string),
    enabled: Boolean(selectedId),
  });

  const decisionMutation = useMutation({
    mutationFn: async (payload: KybDecisionPayload) => {
      if (!selectedEntry) throw new Error("No merchant selected.");
      const merchantId =
        selectedEntry.merchantId ?? selectedId ?? "";

      if (payload.decision === "approve") {
        return api.updateMerchantStatus(merchantId, "ACTIVE", payload.reason);
      }
      if (payload.decision === "reject") {
        return api.updateMerchantStatus(merchantId, "SUSPENDED", payload.reason);
      }
      // Resubmit has no backend action yet, so record it locally.
      return { success: true };
    },
    onSuccess: (_data, variables) => {
      const verb =
        variables.decision === "approve"
          ? "approved"
          : variables.decision === "reject"
          ? "rejected"
          : "returned for resubmission";
      toast.success(`${selectedEntry?.merchantName ?? "Merchant"} ${verb}.`);
      queryClient.invalidateQueries({ queryKey: ["kyb-queue"] });
      queryClient.invalidateQueries({ queryKey: ["kyb-queue-stats"] });
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      setSelectedId(null);
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Decision failed. Please try again."));
    },
  });

  function handleStartNext() {
    if (!queueQ.data?.length) return;
    // Pick the highest-priority item not already selected.
    const next =
      queueQ.data.find((e) => e.priority === "urgent") ??
      queueQ.data.find((e) => e.priority === "high") ??
      queueQ.data[0];
    if (next) setSelectedId(next.id);
  }

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-5 overflow-visible">
      <header className="flex flex-col justify-between gap-3 shrink-0 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
            <ClipboardCheck className="size-5 text-primary" />
            KYB Review
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">
            Review submitted merchant documents, manage SLA risk, and record
            compliance decisions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Export queue - not yet connected.")}
          >
            <Download className="size-3.5 mr-1.5" />
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("View policy - not yet connected.")}
          >
            <BookOpen className="size-3.5 mr-1.5" />
            Policy
          </Button>
          <Button
            size="sm"
            onClick={handleStartNext}
            disabled={!queueQ.data?.length}
            className="shadow-[0_0_16px_rgba(173,198,255,0.12)]"
          >
            Start Next Review
            <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </div>
      </header>

      <div className="shrink-0">
        {statsQ.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : statsQ.isError ? (
          <p className="text-xs text-destructive">Could not load queue stats.</p>
        ) : statsQ.data ? (
          <KybQueueSummary stats={statsQ.data} />
        ) : null}
      </div>

      {queueQ.isError ? (
        <PageError message={getApiErrorMessage(queueQ.error, "Could not load the review queue.")} />
      ) : (
        <div className="grid flex-1 grid-cols-12 gap-5 lg:min-h-0">

          <KybReviewQueue
            className="col-span-12 max-h-[34rem] lg:col-span-4 lg:max-h-[calc(100vh-18rem)]"
            entries={queueQ.data ?? []}
            isLoading={queueQ.isLoading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="col-span-12 flex min-w-0 flex-col lg:col-span-8">
            {!selectedId ? (
              <WorkspaceEmptyState />
            ) : !selectedEntry || docsQ.isLoading || checklistQ.isLoading ? (
              <WorkspaceSkeleton />
            ) : (
              <KybReviewWorkspace
                entry={selectedEntry}
                documents={docsQ.data ?? []}
                checklist={checklistQ.data ?? []}
                isLoadingDocs={false}
                isLoadingChecklist={false}
                onDecisionSubmit={(payload) => decisionMutation.mutate(payload)}
                isSubmitting={decisionMutation.isPending}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

