"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WebhookPayload } from "@/lib/types";

interface WebhookPayloadPreviewProps {
  payload?: WebhookPayload;
  className?: string;
  maxHeight?: string;
}

export function WebhookPayloadPreview({
  payload,
  className,
  maxHeight = "400px",
}: WebhookPayloadPreviewProps) {
  const [, setCopied] = useState(false);

  if (!payload) {
    return <div className={cn("rounded-lg border border-white/10 bg-black/20 p-4", className)}>
      <p className="text-sm text-muted-foreground">No payload available</p>
    </div>;
  }

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("Payload copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Payload JSON</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          aria-label="Copy payload JSON"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="overflow-auto rounded-lg border border-white/10 bg-black/30 p-4"
        style={{ maxHeight }}
      >
        <pre className="font-mono text-xs leading-relaxed">
          <code className="text-muted-foreground">{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}

