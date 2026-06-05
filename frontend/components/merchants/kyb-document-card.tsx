"use client";

import {
  Building2,
  User,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KybDocumentDetail } from "@/lib/types";
import { toast } from "sonner";


const DOC_ICON: Record<KybDocumentDetail["docType"], React.ComponentType<{ className?: string }>> = {
  business_registration: Building2,
  owner_identity: User,
  bank_account_proof: CreditCard,
};

const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    border: "",
    iconCls: "text-emerald-400",
  },
  pending: {
    label: "Pending Review",
    icon: Clock,
    pill: "bg-secondary/15 text-secondary border-secondary/25",
    border: "border-l-2 border-l-primary",
    iconCls: "text-secondary",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    pill: "bg-destructive/15 text-destructive border-destructive/25",
    border: "border-l-2 border-l-destructive",
    iconCls: "text-destructive",
  },
  not_uploaded: {
    label: "Not Uploaded",
    icon: Upload,
    pill: "bg-white/5 text-muted-foreground border-white/10",
    border: "opacity-60",
    iconCls: "text-muted-foreground",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


interface KybDocumentCardProps {
  doc: KybDocumentDetail;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestResubmission?: (id: string) => void;
}

export function KybDocumentCard({
  doc,
  onApprove,
  onReject,
  onRequestResubmission,
}: KybDocumentCardProps) {
  const cfg = STATUS_CONFIG[doc.status];
  const DocIcon = DOC_ICON[doc.docType];
  const StatusIcon = cfg.icon;

  const iconBg =
    doc.status === "verified"
      ? "bg-emerald-500/10"
      : doc.status === "rejected"
      ? "bg-destructive/10"
      : doc.status === "pending"
      ? "bg-primary/10"
      : "bg-white/5";

  const iconColor =
    doc.status === "verified"
      ? "text-emerald-400"
      : doc.status === "rejected"
      ? "text-destructive"
      : doc.status === "pending"
      ? "text-primary"
      : "text-muted-foreground";

  return (
    <article
      className={cn(
        "glass-panel rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.07]",
        cfg.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              "size-11 rounded-lg flex items-center justify-center shrink-0",
              iconBg,
            )}
          >
            <DocIcon className={cn("size-5", iconColor)} />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-sm font-medium text-foreground">{doc.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {doc.uploadedAt
                ? `Uploaded ${formatDate(doc.uploadedAt)}`
                : "Not yet uploaded"}
              {doc.fileType && doc.fileSize
                ? ` - ${doc.fileType} (${doc.fileSize})`
                : ""}
            </p>

            {doc.reviewedBy && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Reviewed by{" "}
                <span className="text-foreground/80">{doc.reviewedBy}</span>
                {doc.reviewedAt ? ` on ${formatDate(doc.reviewedAt)}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border",
              cfg.pill,
            )}
          >
            <StatusIcon className="size-3" />
            {cfg.label}
          </span>

          {doc.status !== "not_uploaded" && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => toast.info(`Document preview for ${doc.name} is not connected in this preview.`)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
                title="View document"
                aria-label={`View ${doc.name}`}
              >
                <Eye className="size-4" />
              </button>

              {doc.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onApprove
                        ? onApprove(doc.id)
                        : toast.info(`Document approval for ${doc.name} is not connected in this preview.`)
                    }
                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                    title="Approve"
                    aria-label={`Approve ${doc.name}`}
                  >
                    <ThumbsUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onReject
                        ? onReject(doc.id)
                        : toast.info(`Document rejection for ${doc.name} is not connected in this preview.`)
                    }
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="Reject"
                    aria-label={`Reject ${doc.name}`}
                  >
                    <ThumbsDown className="size-4" />
                  </button>
                </>
              )}

              {doc.status === "rejected" && (
                <button
                  type="button"
                  onClick={() =>
                    onRequestResubmission
                      ? onRequestResubmission(doc.id)
                      : toast.info(`Resubmission request for ${doc.name} is not connected in this preview.`)
                  }
                  className="p-1.5 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
                  title="Request resubmission"
                  aria-label={`Request resubmission for ${doc.name}`}
                >
                  <RotateCcw className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {doc.status === "rejected" && doc.decisionReason && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
          <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/80 leading-relaxed">{doc.decisionReason}</p>
        </div>
      )}
    </article>
  );
}

