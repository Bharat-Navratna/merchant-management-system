import Link from "next/link";
import { ClipboardList, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MerchantAuditEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ACTION_CLS: Record<string, string> = {
  KYB_APPROVED:         "text-emerald-300",
  DOCUMENT_APPROVED:    "text-emerald-300",
  MERCHANT_CREATED:     "text-primary",
  DOCUMENT_REJECTED:    "text-destructive",
  STATUS_CHANGED:       "text-secondary",
  MERCHANT_SUSPENDED:   "text-destructive",
  RISK_SCORE_UPDATE:    "text-orange-300",
  SLA_REMINDER_SENT:    "text-yellow-300",
};

interface MerchantAuditPreviewProps {
  entries: MerchantAuditEntry[];
  merchantId: string;
}

export function MerchantAuditPreview({ entries, merchantId }: MerchantAuditPreviewProps) {
  const isEmpty = entries.length === 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ClipboardList className="size-4 text-primary" />
            Audit Trail
          </CardTitle>
          <Link
            href={`/audit?merchant=${merchantId}`}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="View full audit log"
          >
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No audit entries for this merchant.</p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 py-2">
                    Actor
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 py-2">
                    Action
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 py-2 hidden sm:table-cell">
                    Entity
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 py-2 hidden md:table-cell">
                    Request ID
                  </th>
                  <th className="text-right text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 py-2">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-2 py-2.5 font-medium text-foreground/80 whitespace-nowrap">
                      {entry.actor}
                    </td>
                    <td className="px-2 py-2.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-mono font-semibold",
                          ACTION_CLS[entry.action] ?? "text-muted-foreground",
                        )}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 hidden sm:table-cell">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {entry.entity}
                      </code>
                    </td>
                    <td className="px-2 py-2.5 hidden md:table-cell">
                      <code className="font-mono text-[10px] text-muted-foreground/60">
                        {entry.requestId}
                      </code>
                    </td>
                    <td className="px-2 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {entries.length > 0 && (
          <p className="text-[10px] text-muted-foreground mt-3">
            Showing {entries.length} most recent entries -{" "}
            <Link
              href={`/audit?merchant=${merchantId}`}
              className="text-primary hover:underline"
            >
              View full log
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

