"use client";

import { MoreVertical, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookDeliveryStatusBadge } from "@/components/webhooks/webhook-delivery-status-badge";
import { WebhookSubscription } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type WebhookSubscriptionsProps = {
  subscriptions: WebhookSubscription[];
};

const healthClass = {
  healthy: "bg-success",
  degraded: "bg-warning",
  unhealthy: "bg-destructive",
};

const statusClass = {
  active: "border-success/30 bg-success/10 text-success",
  paused: "border-warning/30 bg-warning/10 text-warning",
  inactive: "border-white/10 bg-white/[0.04] text-muted-foreground",
  unhealthy: "border-destructive/30 bg-destructive/10 text-destructive",
};

const secretClass = {
  active: "border-success/30 bg-success/10 text-success",
  expired: "border-warning/30 bg-warning/10 text-warning",
  compromised: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatDate(value?: string) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export function WebhookSubscriptionsPanel({ subscriptions }: WebhookSubscriptionsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-white/5">
        <div>
          <CardTitle className="text-2xl">Webhook Subscriptions</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Registered endpoints receiving signed merchant operations events.
          </p>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {subscriptions.filter((subscription) => subscription.status === "active").length} active
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {subscriptions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium">No webhook subscriptions configured</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Register an endpoint to start receiving merchant lifecycle events.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Endpoint</th>
                  <th className="px-5 py-4 font-semibold">Events</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Secret</th>
                  <th className="px-5 py-4 font-semibold">Created By</th>
                  <th className="px-5 py-4 font-semibold">Last Delivery</th>
                  <th className="px-5 py-4 font-semibold">Health</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-white/[0.03]">
                    <td className="max-w-[260px] px-5 py-4">
                      <code className="block truncate font-mono text-xs text-primary" title={subscription.endpoint}>
                        {subscription.endpoint}
                      </code>
                      <p className="mt-1 break-words text-xs text-muted-foreground">
                        {subscription.successRate?.toFixed(1) ?? "--"}% success - {subscription.averageLatency ?? "--"}ms avg
                      </p>
                    </td>
                    <td className="max-w-[240px] px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {subscription.eventTypes.slice(0, 2).map((eventType) => (
                          <span key={eventType} className="rounded-full bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-muted-foreground">
                            <span title={eventType}>{eventType}</span>
                          </span>
                        ))}
                        {subscription.eventTypes.length > 2 && (
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary">
                            +{subscription.eventTypes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", statusClass[subscription.status])}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", secretClass[subscription.signingSecretStatus])}>
                        <ShieldCheck className="h-3 w-3" />
                        {subscription.signingSecretStatus}
                      </span>
                    </td>
                    <td className="max-w-[180px] px-5 py-4">
                      <span className="block break-words text-muted-foreground">{subscription.createdBy}</span>
                    </td>
                    <td className="max-w-[180px] px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{formatDate(subscription.lastDeliveryAt)}</p>
                        {subscription.lastDeliveryStatus && (
                          <WebhookDeliveryStatusBadge
                            status={subscription.lastDeliveryStatus}
                            className="px-2 py-0.5"
                            showIcon={false}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 text-xs capitalize text-muted-foreground">
                        <span className={cn("h-2.5 w-2.5 rounded-full", healthClass[subscription.health])} />
                        {subscription.health}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Subscription actions"
                        onClick={() => toast.info("Subscription actions are not connected in this preview.")}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

