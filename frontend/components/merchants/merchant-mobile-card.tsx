"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Webhook } from "lucide-react";
import { KybProgress } from "@/components/merchants/kyb-progress";
import { MerchantRowActions } from "@/components/merchants/merchant-row-actions";
import { Badge } from "@/components/ui/badge";
import { Merchant } from "@/lib/types";
import { cn } from "@/lib/utils";

type MerchantMobileCardProps = {
  merchant: Merchant;
};

const riskClass = {
  low: "border-tertiary/30 bg-tertiary/10 text-tertiary",
  medium: "border-primary/30 bg-primary/10 text-primary",
  high: "border-warning/30 bg-warning/10 text-warning",
  critical: "border-destructive/40 bg-destructive/15 text-destructive",
};

function statusVariant(status: Merchant["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "suspended" || status === "restricted" || status === "failed") return "destructive";
  return "info";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MerchantMobileCard({ merchant }: MerchantMobileCardProps) {
  const router = useRouter();
  const riskLevel = merchant.riskLevel ?? "medium";

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/merchants/${merchant.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(`/merchants/${merchant.id}`);
      }}
      className="glass-panel cursor-pointer rounded-xl p-4 transition-colors hover:bg-white/[0.07]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-display text-sm font-semibold text-primary">
          {initials(merchant.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold">{merchant.name}</p>
          <p className="break-all text-sm text-muted-foreground" title={merchant.email}>{merchant.email}</p>
        </div>
        <MerchantRowActions merchantId={merchant.id} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={statusVariant(merchant.status)} className="capitalize">{merchant.status}</Badge>
        <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", riskClass[riskLevel])}>
          {riskLevel}
        </span>
        <Badge variant="info">{merchant.category ?? "General"}</Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="break-words">{merchant.country}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Webhook className="h-4 w-4 shrink-0" />
          <span className="break-words">
            {merchant.webhookEvents ?? 0} events - {merchant.latestWebhookStatus ?? "pending"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Created {merchant.createdAt}</span>
        </div>
      </div>

      <div className="mt-4">
        <KybProgress
          compact
          verified={merchant.kybVerifiedDocuments}
          required={merchant.kybRequiredDocuments}
        />
      </div>
    </article>
  );
}

