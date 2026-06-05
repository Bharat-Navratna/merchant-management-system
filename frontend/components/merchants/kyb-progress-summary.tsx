import { FileCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { KybDocumentDetail } from "@/lib/types";

interface KybProgressSummaryProps {
  documents: KybDocumentDetail[];
}

export function KybProgressSummary({ documents }: KybProgressSummaryProps) {
  const total = documents.length;
  const verified = documents.filter((d) => d.status === "verified").length;
  const pending = documents.filter((d) => d.status === "pending").length;
  const rejected = documents.filter((d) => d.status === "rejected").length;
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0;

  const trackColor =
    verified === total
      ? "bg-emerald-400"
      : rejected > 0
      ? "bg-destructive"
      : "bg-primary";

  return (
    <div className="flex items-center justify-between gap-4 px-1 py-0.5">
      <div className="flex items-center gap-2.5">
        {verified === total ? (
          <FileCheck className="size-4 text-emerald-400 shrink-0" />
        ) : (
          <FileText className="size-4 text-primary shrink-0" />
        )}
        <div>
          <span className="text-sm font-semibold text-foreground">
            {verified} of {total}
          </span>{" "}
          <span className="text-sm text-muted-foreground">documents verified</span>
          {pending > 0 && (
            <span className="ml-2 text-[11px] text-secondary">
              - {pending} pending
            </span>
          )}
          {rejected > 0 && (
            <span className="ml-1 text-[11px] text-destructive">
              - {rejected} rejected
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", trackColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
      </div>
    </div>
  );
}

