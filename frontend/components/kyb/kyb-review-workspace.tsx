"use client";

import { History, Share2, MapPin, Tag, FileText, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { KybQueueEntry, KybDocumentDetail, KybChecklistItem } from "@/lib/types";
import { KybSlaBadge } from "@/components/kyb/kyb-sla-badge";
import { KybDocumentCard } from "@/components/merchants/kyb-document-card";
import { KybProgressSummary } from "@/components/merchants/kyb-progress-summary";
import { KybReviewChecklist } from "@/components/kyb/kyb-review-checklist";
import { KybDecisionPanel, KybDecisionPayload } from "@/components/kyb/kyb-decision-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";


const RISK_PILL: Record<KybQueueEntry["riskLevel"], string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  critical: "bg-destructive/15 text-destructive border-destructive/25",
};


export function WorkspaceEmptyState() {
  return (
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="size-16 rounded-full bg-white/[0.04] flex items-center justify-center">
        <FileText className="size-7 text-muted-foreground/50" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-foreground">
          No merchant selected
        </h3>
        <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
          Select a merchant from the queue to begin review.
        </p>
      </div>
    </div>
  );
}


export function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 md:min-h-0">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}


interface KybReviewWorkspaceProps {
  entry: KybQueueEntry;
  documents: KybDocumentDetail[];
  checklist: KybChecklistItem[];
  isLoadingDocs: boolean;
  isLoadingChecklist: boolean;
  onDecisionSubmit: (payload: KybDecisionPayload) => void;
  isSubmitting: boolean;
}

export function KybReviewWorkspace({
  entry,
  documents,
  checklist,
  isLoadingDocs,
  isLoadingChecklist,
  onDecisionSubmit,
  isSubmitting,
}: KybReviewWorkspaceProps) {
  return (
    <div className="flex flex-col gap-5 min-w-0">

      <div className="glass-panel rounded-xl px-5 py-4 shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UserCircle className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="max-w-full truncate text-base font-semibold text-foreground">
                  {entry.merchantName}
                </h2>
                <code className="max-w-[12rem] truncate rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:max-w-none">
                  {entry.requestId}
                </code>
                {entry.status === "escalated" && (
                  <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/25 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    Escalated
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Tag className="size-3" /> {entry.category}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" /> {entry.country}
                </span>
                <span className="flex items-center gap-1">
                  <UserCircle className="size-3" />
                  {entry.assignedReviewer === "Unassigned"
                    ? <span className="text-muted-foreground/50">Unassigned</span>
                    : entry.assignedReviewer}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-full border text-[10px] font-semibold",
                    RISK_PILL[entry.riskLevel],
                  )}
                >
                  {entry.riskLevel.charAt(0).toUpperCase() + entry.riskLevel.slice(1)} Risk
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                SLA Remaining
              </p>
              <KybSlaBadge deadlineIso={entry.slaDeadlineIso} className="text-sm!" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-muted-foreground hover:text-foreground transition-all"
                title="View review history"
                onClick={() => toast.info("Review history is available from the merchant audit trail.")}
              >
                <History className="size-3.5" />
                History
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-muted-foreground hover:text-foreground transition-all"
                title="Escalate to senior reviewer"
                onClick={() => toast.info("Escalation routing is not connected in this preview.")}
              >
                <Share2 className="size-3.5" />
                Escalate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 overflow-visible md:grid-cols-2">

        <div className="flex flex-col gap-4 md:overflow-y-auto min-h-0 custom-scrollbar">
          <div className="glass-panel rounded-xl px-4 py-3 shrink-0">
            <KybProgressSummary documents={documents} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-1">
              Submitted Documents
            </p>

            {isLoadingDocs ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="glass-panel rounded-xl p-5 text-center">
                <p className="text-xs text-muted-foreground">
                  No documents submitted yet.
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <KybDocumentCard
                  key={doc.id}
                  doc={doc}
                  onApprove={() => undefined}
                  onReject={() => undefined}
                  onRequestResubmission={() => undefined}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:overflow-y-auto min-h-0 custom-scrollbar">
          {isLoadingChecklist ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <KybReviewChecklist items={checklist} />
          )}

          <KybDecisionPanel
            merchantName={entry.merchantName}
            onSubmit={onDecisionSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}


