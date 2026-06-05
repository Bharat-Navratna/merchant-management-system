"use client";

import { toast } from "sonner";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookSigningSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const secretStatusConfig = {
  active: { label: "Active", className: "border-success/25 bg-success/10 text-success" },
  rotation_pending: { label: "Rotation Pending", className: "border-warning/25 bg-warning/10 text-warning" },
  expired: { label: "Expired", className: "border-destructive/25 bg-destructive/10 text-destructive" },
};

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <p className="shrink-0 text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "min-w-0 text-right text-sm",
          mono ? "font-mono text-primary" : "font-medium text-foreground",
          mono ? "truncate" : "break-words",
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export function WebhookSigningSettingsCard({ settings }: { settings: WebhookSigningSettings }) {
  const statusCfg = secretStatusConfig[settings.secretStatus];

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-tertiary" />
              Webhook Signing Settings
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              HMAC signature configuration for all outbound webhook payloads.
            </p>
          </div>
          <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold", statusCfg.className)}>
            {statusCfg.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Row label="Signing Algorithm" value={settings.algorithm} />
        <Row label="Signature Header" value={settings.signatureHeader} mono />
        <Row label="Replay Protection Window" value={settings.replayProtectionWindow} />
        <Row label="Timestamp Tolerance" value={settings.timestampTolerance} />
        <div className="mt-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Secret rotation is not connected in this preview.")}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rotate Secret
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

