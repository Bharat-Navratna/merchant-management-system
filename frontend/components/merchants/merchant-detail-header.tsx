"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MerchantDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  active:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  pending:
    "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  "under review":
    "bg-secondary/20 text-secondary border-secondary/30",
  restricted:
    "bg-destructive/20 text-destructive border-destructive/30",
  suspended:
    "bg-destructive/20 text-destructive border-destructive/30",
  failed:
    "bg-destructive/20 text-destructive border-destructive/30",
};

const riskStyles: Record<string, string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
};

const riskDot: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-destructive",
};


interface MerchantDetailHeaderProps {
  merchant: MerchantDetail;
  onApprove?: () => void;
  onSuspend?: () => void;
  onRequestInfo?: () => void;
  onAssignReviewer?: () => void;
  isUpdating?: boolean;
}

export function MerchantDetailHeader({
  merchant,
  onApprove,
  onSuspend,
  onRequestInfo,
  onAssignReviewer,
  isUpdating,
}: MerchantDetailHeaderProps) {
  const statusKey = merchant.status.toLowerCase();
  const riskKey = (merchant.riskLevel ?? "low").toLowerCase();

  return (
    <header className="space-y-4 mb-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/merchants"
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3" />
          Merchants
        </Link>
        <ChevronRight className="size-3 opacity-40" />
        <span className="max-w-[260px] break-words text-foreground/70">
          {merchant.name}
        </span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2.5 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words font-display text-2xl font-semibold leading-tight text-primary md:text-[28px]">
              {merchant.name}
            </h1>

            {merchant.riskLevel && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                  riskStyles[riskKey],
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    riskDot[riskKey],
                    riskKey === "critical" && "animate-pulse",
                  )}
                />
                {merchant.riskLevel.charAt(0).toUpperCase() +
                  merchant.riskLevel.slice(1)}{" "}
                Risk
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[11px]">
              ID: {merchant.id.toUpperCase()}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                statusStyles[statusKey] ?? "bg-white/5 text-muted-foreground border-white/10",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  statusKey === "active"
                    ? "bg-emerald-400 animate-pulse"
                    : statusKey === "pending" || statusKey === "under review"
                    ? "bg-secondary"
                    : "bg-destructive",
                )}
              />
              {merchant.status
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </span>

            <span className="opacity-60">-</span>
            <span>Joined {formatDate(merchant.createdAt)}</span>

            {merchant.updatedAt && merchant.updatedAt !== merchant.createdAt && (
              <>
                <span className="opacity-40">-</span>
                <span>Updated {formatDate(merchant.updatedAt)}</span>
              </>
            )}

            <span className="opacity-60">-</span>
            <span>{merchant.email}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onRequestInfo}
            disabled={isUpdating}
          >
            Request Info
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onAssignReviewer}
            disabled={isUpdating}
          >
            Assign Reviewer
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            onClick={onSuspend}
            disabled={isUpdating || merchant.status === "suspended"}
          >
            Suspend
          </Button>

          <Button
            size="sm"
            onClick={onApprove}
            disabled={isUpdating || merchant.status === "active"}
            className="shadow-[0_0_18px_rgba(173,198,255,0.15)]"
          >
            {isUpdating ? "Saving..." : "Approve Merchant"}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="size-9"
            aria-label="More actions"
            onClick={() => toast.info("Additional merchant actions will appear here as workflows are connected.")}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="h-px bg-white/[0.07]" />
    </header>
  );
}

