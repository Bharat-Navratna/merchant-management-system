"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookDeliveryStatusBadge } from "@/components/webhooks/webhook-delivery-status-badge";
import { WebhookDelivery } from "@/lib/types";
import { cn } from "@/lib/utils";

type WebhookDeliveryLogProps = {
  deliveries: WebhookDelivery[];
  selectedId?: string;
  onSelect: (delivery: WebhookDelivery) => void;
};

function formatTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatHttpStatus(status?: number) {
  if (!status) return "-";
  return status.toString();
}

function httpStatusClass(status?: number) {
  if (!status) return "text-muted-foreground";
  if (status >= 500) return "text-destructive";
  if (status >= 400) return "text-warning";
  if (status >= 200 && status < 300) return "text-success";
  return "text-muted-foreground";
}

export function WebhookDeliveryLog({ deliveries, selectedId, onSelect }: WebhookDeliveryLogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDeliveries = useMemo(() => {
    if (!searchQuery.trim()) return deliveries;
    const query = searchQuery.toLowerCase();
    return deliveries.filter((delivery) =>
      [
        delivery.eventId,
        delivery.eventType,
        delivery.merchantName,
        delivery.endpoint,
        delivery.requestId,
        delivery.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [deliveries, searchQuery]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b border-white/5">
        <div>
          <CardTitle className="text-2xl">Delivery Log</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Inspect every signed callback attempt, retry, and terminal delivery state.
          </p>
        </div>
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search event ID, merchant, endpoint, request ID..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {deliveries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium">No webhook deliveries yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Delivery events will appear here once merchant status changes emit webhooks.
            </p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium">No matching deliveries</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different event ID, merchant, or endpoint.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1180px] text-sm">
                <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Event ID</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Merchant</th>
                    <th className="px-5 py-4 font-semibold">Endpoint</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">HTTP</th>
                    <th className="px-5 py-4 font-semibold">Attempts</th>
                    <th className="px-5 py-4 font-semibold">Next Retry</th>
                    <th className="px-5 py-4 font-semibold">Latency</th>
                    <th className="px-5 py-4 font-semibold">Request ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      onClick={() => onSelect(delivery)}
                      className={cn(
                        "cursor-pointer hover:bg-white/[0.04]",
                        selectedId === delivery.id && "bg-primary/10",
                      )}
                    >
                      <td className="max-w-[140px] px-5 py-4">
                        <code className="block truncate font-mono text-xs text-primary" title={delivery.eventId}>{delivery.eventId}</code>
                      </td>
                      <td className="max-w-[160px] px-5 py-4">
                        <code className="block break-words font-mono text-xs text-muted-foreground">{delivery.eventType}</code>
                      </td>
                      <td className="max-w-[160px] px-5 py-4">
                        <span className="block break-words">{delivery.merchantName}</span>
                      </td>
                      <td className="max-w-[220px] px-5 py-4">
                        <code className="block truncate font-mono text-xs text-muted-foreground" title={delivery.endpoint}>{delivery.endpoint}</code>
                      </td>
                      <td className="px-5 py-4">
                        <WebhookDeliveryStatusBadge status={delivery.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("font-mono text-xs", httpStatusClass(delivery.httpStatus))}>
                          {formatHttpStatus(delivery.httpStatus)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{delivery.attempts.length}</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatTime(delivery.nextRetryTime)}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {delivery.latency ? `${delivery.latency}ms` : "-"}
                      </td>
                      <td className="max-w-[170px] px-5 py-4">
                        <code className="block truncate font-mono text-xs text-tertiary" title={delivery.requestId}>{delivery.requestId}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {filteredDeliveries.map((delivery) => (
                <button
                  type="button"
                  key={delivery.id}
                  onClick={() => onSelect(delivery)}
                  className={cn(
                    "rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/[0.06]",
                    selectedId === delivery.id && "border-primary/30 bg-primary/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <code className="block truncate font-mono text-xs text-primary" title={delivery.eventId}>{delivery.eventId}</code>
                      <p className="mt-1 break-words text-sm font-medium">{delivery.eventType}</p>
                      <p className="break-words text-xs text-muted-foreground">{delivery.merchantName}</p>
                    </div>
                    <WebhookDeliveryStatusBadge status={delivery.status} className="shrink-0" />
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                    <code className="truncate font-mono" title={delivery.endpoint}>{delivery.endpoint}</code>
                    <div className="flex items-center justify-between gap-3">
                      <span>HTTP {formatHttpStatus(delivery.httpStatus)}</span>
                      <span>{delivery.attempts.length} attempts</span>
                      <span>{delivery.latency ? `${delivery.latency}ms` : "-"}</span>
                    </div>
                    <code className="truncate font-mono text-tertiary" title={delivery.requestId}>{delivery.requestId}</code>
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

