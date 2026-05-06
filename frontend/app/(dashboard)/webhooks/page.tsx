"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";

export default function WebhooksPage() {
  const eventsQuery = useQuery({ queryKey: ["webhooks"], queryFn: api.getWebhookEvents });
  const retryMutation = useMutation({
    mutationFn: api.retryWebhookEvent,
    onSuccess: () => toast.success("Webhook retry queued successfully."),
    onError: () => toast.error("Failed to retry webhook."),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Webhooks</h2>
        <p className="text-sm text-muted-foreground">Track delivery status and replay failed events.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left">Event Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Retry Count</th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {eventsQuery.data?.map((event) => (
                  <tr key={event.id} className="border-t border-border">
                    <td className="px-4 py-3">{event.eventType}</td>
                    <td className="px-4 py-3"><StatusPill status={event.status} /></td>
                    <td className="px-4 py-3">{event.retryCount}</td>
                    <td className="px-4 py-3">{new Date(event.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => retryMutation.mutate()}>
                        Retry
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Delivery Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>11:05 - merchant.kyb.approved delivered successfully.</p>
          <p>10:45 - merchant.kyb.rejected failed and scheduled for retry.</p>
          <p>10:10 - payout.failed currently retrying.</p>
        </CardContent>
      </Card>
    </div>
  );
}
