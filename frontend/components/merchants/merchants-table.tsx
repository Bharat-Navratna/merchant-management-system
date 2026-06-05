"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Webhook } from "lucide-react";
import { KybProgress } from "@/components/merchants/kyb-progress";
import { MerchantMobileCard } from "@/components/merchants/merchant-mobile-card";
import { MerchantRowActions } from "@/components/merchants/merchant-row-actions";
import { Badge } from "@/components/ui/badge";
import { Merchant } from "@/lib/types";
import { cn } from "@/lib/utils";

type MerchantsTableProps = {
  data: Merchant[];
};

const riskClass = {
  low: "border-tertiary/30 bg-tertiary/10 text-tertiary",
  medium: "border-primary/30 bg-primary/10 text-primary",
  high: "border-warning/30 bg-warning/10 text-warning",
  critical: "border-destructive/40 bg-destructive/15 text-destructive",
};

const webhookClass = {
  delivered: "text-success",
  retrying: "text-primary",
  failed: "text-destructive",
  pending: "text-warning",
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

function MerchantAvatar({ merchant }: { merchant: Merchant }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-display text-sm font-semibold text-primary">
      {initials(merchant.name)}
      <span
        className={cn(
          "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
          merchant.status === "active" ? "bg-success" : merchant.status === "pending" ? "bg-warning" : "bg-destructive",
        )}
      />
    </div>
  );
}

export function MerchantsTable({ data }: MerchantsTableProps) {
  const router = useRouter();

  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {data.map((merchant) => (
          <MerchantMobileCard key={merchant.id} merchant={merchant} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Merchant</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Risk</th>
                <th className="px-5 py-4 font-semibold">KYB Progress</th>
                <th className="px-5 py-4 font-semibold">Webhook Events</th>
                <th className="px-5 py-4 font-semibold">Created</th>
                <th className="px-5 py-4 font-semibold">Updated</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((merchant) => {
                const riskLevel = merchant.riskLevel ?? "medium";
                const webhookStatus = merchant.latestWebhookStatus ?? "pending";

                return (
                  <tr
                    key={merchant.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/merchants/${merchant.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") router.push(`/merchants/${merchant.id}`);
                    }}
                    className="cursor-pointer transition-colors hover:bg-white/[0.04]"
                  >
                    <td className="max-w-[260px] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <MerchantAvatar merchant={merchant} />
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-foreground">{merchant.name}</p>
                          <p className="break-all text-xs text-muted-foreground" title={merchant.email}>{merchant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[140px] px-5 py-4">
                      <span className="block break-words">{merchant.category ?? "General"}</span>
                    </td>
                    <td className="max-w-[180px] px-5 py-4">
                      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="break-words">{merchant.country}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant(merchant.status)} className="capitalize">
                        {merchant.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", riskClass[riskLevel])}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="w-[180px] px-5 py-4">
                      <KybProgress
                        verified={merchant.kybVerifiedDocuments}
                        required={merchant.kybRequiredDocuments}
                      />
                    </td>
                    <td className="max-w-[180px] px-5 py-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <Webhook className={cn("h-4 w-4 shrink-0", webhookClass[webhookStatus])} />
                        <div className="min-w-0">
                          <p className="font-medium">{(merchant.webhookEvents ?? 0).toLocaleString()}</p>
                          <p className={cn("text-xs capitalize", webhookClass[webhookStatus])}>
                            {webhookStatus}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[120px] px-5 py-4 text-muted-foreground">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>{merchant.createdAt}</span>
                      </span>
                    </td>
                    <td className="max-w-[120px] px-5 py-4 text-muted-foreground">
                      <span className="block">{merchant.updatedAt ?? "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <MerchantRowActions merchantId={merchant.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

