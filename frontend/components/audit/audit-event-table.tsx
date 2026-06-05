import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog } from "@/lib/types";
import { AuditSeverityBadge } from "@/components/audit/audit-severity-badge";
import { cn } from "@/lib/utils";

type AuditEventTableProps = {
  events: AuditLog[];
  selectedId?: string;
  onSelect: (event: AuditLog) => void;
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function AuditEventTable({ events, selectedId, onSelect }: AuditEventTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-2xl">Audit Event Table</CardTitle>
        <p className="text-sm text-muted-foreground">
          Immutable operational events with request IDs and investigation metadata.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {events.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium">No audit events found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening your filters or date range.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1120px] text-sm">
                <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Timestamp</th>
                    <th className="px-5 py-4 font-semibold">Actor</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                    <th className="px-5 py-4 font-semibold">Entity</th>
                    <th className="px-5 py-4 font-semibold">Severity</th>
                    <th className="px-5 py-4 font-semibold">IP Address</th>
                    <th className="px-5 py-4 font-semibold">Request ID</th>
                    <th className="px-5 py-4 font-semibold">Metadata / View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      onClick={() => onSelect(event)}
                      className={cn(
                        "cursor-pointer hover:bg-white/[0.04]",
                        selectedId === event.id && "bg-primary/10",
                      )}
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </td>
                      <td className="max-w-[180px] px-5 py-4">
                        <p className="break-words font-medium text-foreground">{event.actor}</p>
                        <p className="break-words text-xs uppercase text-muted-foreground">
                          {event.actorRole ?? "Operator"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <code className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-primary">
                          {event.action}
                        </code>
                      </td>
                      <td className="max-w-[180px] px-5 py-4">
                        <code className="block truncate font-mono text-xs text-foreground" title={event.entity}>
                          {event.entity}
                        </code>
                        <span className="text-xs capitalize text-muted-foreground">
                          {event.entityType ?? "system"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <AuditSeverityBadge severity={event.severity} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted-foreground">
                        {event.ipAddress}
                      </td>
                      <td className="max-w-[160px] px-5 py-4">
                        <code className="block truncate font-mono text-xs text-tertiary" title={event.requestId}>
                          {event.requestId}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            onSelect(event);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 xl:hidden">
              {events.map((event) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className={cn(
                    "rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left",
                    selectedId === event.id && "border-primary/30 bg-primary/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{event.actor}</p>
                      <code className="mt-1 block break-words font-mono text-xs text-primary">
                        {event.action}
                      </code>
                    </div>
                    <AuditSeverityBadge severity={event.severity} className="shrink-0" />
                  </div>
                  <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
                    <span>{formatTimestamp(event.timestamp)}</span>
                    <code className="truncate font-mono text-foreground" title={event.entity}>{event.entity}</code>
                    <code className="truncate font-mono text-tertiary" title={event.requestId}>{event.requestId}</code>
                    <span>{event.ipAddress}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-end text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

