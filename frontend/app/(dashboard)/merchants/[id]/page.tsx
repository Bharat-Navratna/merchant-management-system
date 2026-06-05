"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/error";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, SearchX } from "lucide-react";

import { MerchantDetailHeader } from "@/components/merchants/merchant-detail-header";
import { MerchantProfileCard } from "@/components/merchants/merchant-profile-card";
import { KybDocumentCard } from "@/components/merchants/kyb-document-card";
import { KybProgressSummary } from "@/components/merchants/kyb-progress-summary";
import { RiskScorePanel } from "@/components/merchants/risk-score-panel";
import { StatusTimeline } from "@/components/merchants/status-timeline";
import { MerchantWebhookEvents } from "@/components/merchants/merchant-webhook-events";
import { InternalNotesPanel } from "@/components/merchants/internal-notes-panel";
import { MerchantAuditPreview } from "@/components/merchants/merchant-audit-preview";

function DetailSkeleton() {
  return (
    <>
      <div className="mb-8 space-y-4">
        <Skeleton className="h-3 w-24" />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-full max-w-96" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
      </div>

      <div className="grid grid-cols-12 items-start gap-5">
        <div className="col-span-12 space-y-5 lg:col-span-7">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
        <div className="col-span-12 space-y-5 lg:col-span-5">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Merchant not found</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        No merchant matches this ID. It may have been deleted or the link is
        incorrect.
      </p>
      <Link href="/merchants" className="text-sm text-primary hover:underline">
        Back to Merchants
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      <Link href="/merchants" className="text-sm text-primary hover:underline">
        Back to Merchants
      </Link>
    </div>
  );
}

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const merchantQ = useQuery({
    queryKey: ["merchant-detail", id],
    queryFn: () => api.getMerchantDetail(id),
    retry: 1,
  });

  const docsQ = useQuery({
    queryKey: ["kyb-doc-details", id],
    queryFn: () => api.getKybDocumentDetails(id),
  });

  const riskQ = useQuery({
    queryKey: ["merchant-risk", id],
    queryFn: () => api.getMerchantRisk(id),
  });

  const timelineQ = useQuery({
    queryKey: ["merchant-timeline", id],
    queryFn: () => api.getMerchantTimeline(id),
  });

  const webhooksQ = useQuery({
    queryKey: ["merchant-webhooks", id],
    queryFn: () => api.getMerchantWebhookEntries(id),
  });

  const notesQ = useQuery({
    queryKey: ["merchant-notes", id],
    queryFn: () => api.getInternalNotes(id),
  });

  const auditQ = useQuery({
    queryKey: ["merchant-audit", id],
    queryFn: () => api.getMerchantAuditTrail(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: "ACTIVE" | "SUSPENDED"; reason: string }) =>
      api.updateMerchantStatus(id, status, reason),
    onSuccess: () => {
      toast.success("Merchant status updated.");
      queryClient.invalidateQueries({ queryKey: ["merchant-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Failed to update status."));
    },
  });

  if (merchantQ.isLoading) return <DetailSkeleton />;
  if (merchantQ.isError)
    return <ErrorState message={getApiErrorMessage(merchantQ.error, "Could not load merchant.")} />;
  if (!merchantQ.data) return <NotFound />;

  const merchant = merchantQ.data;
  const docs = docsQ.data ?? [];
  const risk = riskQ.data;
  const timeline = timelineQ.data ?? [];
  const webhooks = webhooksQ.data ?? [];
  const notes = notesQ.data ?? [];
  const audit = auditQ.data ?? [];

  return (
    <div className="min-w-0">
      <MerchantDetailHeader
        merchant={merchant}
        isUpdating={statusMutation.isPending}
        onApprove={() =>
          statusMutation.mutate({ status: "ACTIVE", reason: "Approved by operator" })
        }
        onSuspend={() =>
          statusMutation.mutate({ status: "SUSPENDED", reason: "Suspended by operator" })
        }
        onRequestInfo={() => toast.info("Request Info - not yet connected.")}
        onAssignReviewer={() => toast.info("Assign Reviewer - not yet connected.")}
      />

      <div className="grid min-w-0 grid-cols-12 items-start gap-5">
        <div className="col-span-12 space-y-5 lg:col-span-7">

          <MerchantProfileCard merchant={merchant} />

          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                KYB Documents
              </h2>
            </div>

            {docsQ.isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : docs.length === 0 ? (
              <div className="glass-panel rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground">No KYB documents submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="glass-panel rounded-xl px-4 py-3">
                  <KybProgressSummary documents={docs} />
                </div>

                <div className="space-y-2">
                  {docs.map((doc) => (
                    <KybDocumentCard
                      key={doc.id}
                      doc={doc}
                      onApprove={(docId) =>
                        toast.info(`Approve doc ${docId} - backend not yet connected.`)
                      }
                      onReject={(docId) =>
                        toast.info(`Reject doc ${docId} - backend not yet connected.`)
                      }
                      onRequestResubmission={(docId) =>
                        toast.info(`Resubmission requested for ${docId}.`)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {timelineQ.isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <StatusTimeline events={timeline} />
          )}
        </div>

        <div className="col-span-12 space-y-5 lg:col-span-5">

          {riskQ.isLoading ? (
            <Skeleton className="h-80 w-full rounded-xl" />
          ) : risk ? (
            <RiskScorePanel risk={risk} />
          ) : null}

          {webhooksQ.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <MerchantWebhookEvents events={webhooks} merchantId={id} />
          )}

          {notesQ.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <InternalNotesPanel
              notes={notes}
              onAddNote={(content) => {
                toast.info(`Internal note added: "${content.slice(0, 40)}..."`);
              }}
            />
          )}

          {auditQ.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <MerchantAuditPreview entries={audit} merchantId={id} />
          )}
        </div>
      </div>
    </div>
  );
}

