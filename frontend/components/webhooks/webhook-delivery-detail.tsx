"use client";

import { Button } from "@/components/ui/button";
import { WebhookDelivery } from "@/lib/types";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { WebhookDeliveryStatusBadge } from "./webhook-delivery-status-badge";
import { WebhookPayloadPreview } from "./webhook-payload-preview";
import { WebhookAttemptTimeline } from "./webhook-attempt-timeline";

interface WebhookDeliveryDetailProps {
  delivery: WebhookDelivery | null;
  onClose: () => void;
  onReplay?: (deliveryId: string) => void;
}

export function WebhookDeliveryDetail({
  delivery,
  onClose,
  onReplay,
}: WebhookDeliveryDetailProps) {
  const [isReplaying, setIsReplaying] = useState(false);

  if (!delivery) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-5 text-center">
        <p className="font-medium">No delivery selected</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a delivery row to inspect payload, signature, attempts, and replay options.
        </p>
      </div>
    );
  }

  const handleReplay = async () => {
    setIsReplaying(true);
    try {
      if (onReplay) {
        onReplay(delivery.id);
      }
      toast.success("Replay queued");
    } catch {
      toast.error("Failed to queue replay");
    } finally {
      setIsReplaying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="glass-panel flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl xl:sticky xl:top-24">
      <div className="flex items-center justify-between border-b border-white/10 bg-background/70 p-4 backdrop-blur">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-primary">Delivery Detail</h3>
          <code className="block truncate font-mono text-xs text-muted-foreground" title={delivery.eventId}>{delivery.eventId}</code>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          aria-label="Close delivery detail"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5 overflow-y-auto p-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
          <WebhookDeliveryStatusBadge status={delivery.status} />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">Event Details</p>
          <div className="space-y-2">
            <DetailRow label="Event ID" value={delivery.eventId} copyable />
            <DetailRow label="Event Type" value={delivery.eventType} />
            <DetailRow label="Merchant" value={delivery.merchantName} />
            <DetailRow label="Request ID" value={delivery.requestId} copyable mono />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">Delivery Details</p>
          <div className="space-y-2">
            <DetailRow label="Endpoint" value={delivery.endpoint} mono truncate />
            {delivery.httpStatus && (
              <DetailRow label="HTTP Status" value={delivery.httpStatus.toString()} />
            )}
            {delivery.latency && (
              <DetailRow label="Latency" value={`${delivery.latency}ms`} />
            )}
            <DetailRow
              label="Created"
              value={new Date(delivery.createdAt).toLocaleString()}
            />
          </div>
        </div>

        {delivery.signature && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Signature Header</p>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="flex items-start justify-between gap-2">
                <code className="break-all font-mono text-xs text-tertiary">
                  x-stratos-signature: {delivery.signature}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(delivery.signature!, "Signature")}
                  className="flex-shrink-0 rounded p-1 hover:bg-white/[0.06]"
                  aria-label="Copy signature"
                >
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {delivery.payload && <WebhookPayloadPreview payload={delivery.payload} />}

        <WebhookAttemptTimeline attempts={delivery.attempts} />

        {delivery.status === "failed" || delivery.status === "dead_lettered" ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Last Error</p>
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-xs text-destructive">
                {delivery.attempts[delivery.attempts.length - 1]?.errorMessage ||
                  "Service returned error response"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-white/10 bg-background/70 p-4 backdrop-blur">
        {(delivery.status === "failed" || delivery.status === "dead_lettered") && (
          <Button
            onClick={handleReplay}
            disabled={isReplaying}
            className="w-full"
          >
            {isReplaying ? "Queuing..." : "Replay Now"}
          </Button>
        )}
        <Button type="button" onClick={onClose} variant="outline" className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
  truncate?: boolean;
}

function DetailRow({ label, value, copyable, mono, truncate }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="shrink-0 text-xs text-muted-foreground">{label}</p>
      <div className="flex min-w-0 items-center gap-1">
        <p
          title={truncate || mono ? value : undefined}
          className={`text-right text-xs text-foreground ${mono ? "font-mono" : ""} ${truncate ? "max-w-[220px] truncate" : "break-all"}`}
        >
          {value}
        </p>
        {copyable && (
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(value)}
            className="flex-shrink-0 rounded p-0.5 hover:bg-white/[0.06]"
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

