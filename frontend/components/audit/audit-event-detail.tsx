import { Copy, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@/lib/types";
import { AuditSeverityBadge } from "@/components/audit/audit-severity-badge";

type AuditEventDetailProps = {
  event: AuditLog | null;
  onClose: () => void;
};

function formatFullTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "medium",
  });
}

function JsonPreview({ title, value }: { title: string; value?: Record<string, unknown> }) {
  if (!value) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <div className="max-h-56 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-muted-foreground">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between gap-4">
      <p className="shrink-0 text-xs text-muted-foreground">{label}</p>
      <p className={`min-w-0 break-all text-right text-xs text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export function AuditEventDetail({ event, onClose }: AuditEventDetailProps) {
  if (!event) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-5 text-center">
        <ShieldCheck className="mb-3 h-8 w-8 text-primary" />
        <p className="font-medium">No audit event selected</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Select an audit row to inspect actor identity, request context, before/after values, and metadata.
        </p>
      </div>
    );
  }

  const copyRequestId = () => navigator.clipboard.writeText(event.requestId);

  return (
    <div className="glass-panel flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-background/70 p-4 backdrop-blur">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Event Detail</p>
          <h3 className="mt-1 break-words font-display text-lg font-semibold text-primary">
            {event.action}
          </h3>
          <code className="mt-1 block truncate font-mono text-xs text-tertiary" title={event.requestId}>
            {event.requestId}
          </code>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          aria-label="Close audit event detail"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5 overflow-y-auto p-4">
        <div className="flex items-center justify-between gap-3">
          <AuditSeverityBadge severity={event.severity} />
          <Button type="button" variant="outline" size="sm" onClick={copyRequestId}>
            <Copy className="h-4 w-4" />
            Copy Request ID
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Event Context</p>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <DetailRow label="Full timestamp" value={formatFullTimestamp(event.timestamp)} />
            <DetailRow label="Actor" value={event.actor} />
            <DetailRow label="Role" value={event.actorRole} />
            <DetailRow label="Entity type" value={event.entityType} />
            <DetailRow label="Entity ID" value={event.entityId ?? event.entity} mono />
            <DetailRow label="IP address" value={event.ipAddress} mono />
            <DetailRow label="User agent" value={event.userAgent} />
            <DetailRow label="Request ID" value={event.requestId} mono />
            <DetailRow label="Correlation ID" value={event.correlationId} mono />
          </div>
        </div>

        <JsonPreview title="Before values" value={event.before} />
        <JsonPreview title="After values" value={event.after} />
        <JsonPreview title="JSON metadata" value={event.metadata} />
      </div>
    </div>
  );
}

