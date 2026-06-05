"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, RadioTower, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { WebhookDeliveryDetail } from "@/components/webhooks/webhook-delivery-detail";
import { WebhookDeliveryLog } from "@/components/webhooks/webhook-delivery-log";
import { WebhookReliabilityPanel } from "@/components/webhooks/webhook-reliability-panel";
import { WebhookRetryQueue } from "@/components/webhooks/webhook-retry-queue";
import { WebhookSubscriptionsPanel } from "@/components/webhooks/webhook-subscriptions-panel";
import { WebhookSummaryCards } from "@/components/webhooks/webhook-summary-cards";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";
import { WebhookDelivery } from "@/lib/types";

export default function WebhooksPage() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>();

  const webhookOpsQuery = useQuery({
    queryKey: ["webhook-ops"],
    queryFn: api.getWebhookOpsData,
  });

  const replayMutation = useMutation({
    mutationFn: api.replayWebhookDelivery,
    onSuccess: () => toast.success("Replay queued for manual processing."),
    onError: () => toast.error("Unable to queue replay."),
  });

  const deliveries = webhookOpsQuery.data?.deliveries ?? [];
  const activeDeliveryId = selectedDeliveryId === undefined ? deliveries[0]?.id ?? null : selectedDeliveryId;
  const selectedDelivery: WebhookDelivery | null = activeDeliveryId
    ? deliveries.find((delivery) => delivery.id === activeDeliveryId) ?? null
    : null;

  if (webhookOpsQuery.isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Skeleton className="min-h-[420px] w-full" />
          <Skeleton className="min-h-[420px] w-full" />
        </div>
      </div>
    );
  }

  if (webhookOpsQuery.isError || !webhookOpsQuery.data) {
    return (
      <EmptyState
        title="Unable to load webhook operations"
        description="Delivery telemetry could not be loaded. Please try again shortly."
      />
    );
  }

  const { stats, subscriptions, retryQueueBreakdown } = webhookOpsQuery.data;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-tertiary/25 bg-tertiary/10 px-3 py-1 text-xs font-semibold text-tertiary">
            <span className="h-2 w-2 rounded-full bg-tertiary shadow-[0_0_12px_rgba(76,215,246,0.8)]" />
            System healthy - 4.2M events processed today
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Webhook Ops</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Monitor signed event delivery, retries, endpoint health, and failed integrations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info("Webhook documentation will open here once docs routing is connected.")}
          >
            <BookOpen className="h-4 w-4" />
            View Docs
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const failed = deliveries.find((delivery) =>
                ["failed", "dead_lettered"].includes(delivery.status),
              );
              if (failed) {
                replayMutation.mutate(failed.id);
              } else {
                toast.success("No failed webhook deliveries need replay.");
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Replay Failed Events
          </Button>
          <Button
            type="button"
            onClick={() => toast.info("Webhook registration will open here once endpoint creation is connected.")}
          >
            <RadioTower className="h-4 w-4" />
            Register Webhook
          </Button>
        </div>
      </header>

      <WebhookSummaryCards stats={stats} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-5">
          <WebhookSubscriptionsPanel subscriptions={subscriptions} />
          <WebhookDeliveryLog
            deliveries={deliveries}
            selectedId={activeDeliveryId ?? undefined}
            onSelect={(delivery) => setSelectedDeliveryId(delivery.id)}
          />
          <WebhookReliabilityPanel />
        </div>

        <aside className="min-w-0 space-y-5">
          <WebhookRetryQueue breakdown={retryQueueBreakdown} />
          <WebhookDeliveryDetail
            delivery={selectedDelivery}
            onClose={() => setSelectedDeliveryId(null)}
            onReplay={(deliveryId) => replayMutation.mutate(deliveryId)}
          />
        </aside>
      </div>
    </div>
  );
}

