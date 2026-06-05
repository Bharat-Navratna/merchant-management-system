"use client";

import { toast } from "sonner";
import { Copy, KeyRound, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const envConfig = {
  production: "border-success/25 bg-success/10 text-success",
  sandbox: "border-secondary/25 bg-secondary/10 text-secondary",
};

export function ApiKeysSettingsCard({ apiKeys }: { apiKeys: ApiKey[] }) {
  const copyKey = (key: ApiKey) => {
    navigator.clipboard.writeText(key.maskedKey);
    toast.success(`Copied masked key for ${key.name}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-warning" />
              API Keys &amp; Developer Settings
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Active credentials with scopes, environment, and last-used metadata.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info("Key generation is not connected in this preview.")}
          >
            Generate New Key
          </Button>
        </div>
      </CardHeader>

      <div className="border-b border-white/5 bg-tertiary/5 px-5 py-3">
        <p className="text-xs text-tertiary">
          API keys provide full access to your production merchant environment. Always store secrets in an encrypted vault. Revoke keys immediately if compromised.
        </p>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Key Name</th>
                <th className="px-5 py-3 font-semibold">Environment</th>
                <th className="px-5 py-3 font-semibold">Scopes</th>
                <th className="px-5 py-3 font-semibold">Masked Secret</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold">Last Used</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{key.name}</p>
                    <p className="text-xs text-muted-foreground">{key.createdBy}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        envConfig[key.environment],
                      )}
                    >
                      {key.environment}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="rounded border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-muted-foreground select-all">
                      {key.maskedKey}
                    </code>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {key.createdAt}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {key.lastUsedAt ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => copyKey(key)}
                        aria-label={`Copy masked key for ${key.name}`}
                        title="Copy masked key"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-warning"
                        onClick={() => toast.info(`Key rotation for ${key.name} is not connected in this preview.`)}
                        aria-label={`Rotate key ${key.name}`}
                        title="Rotate key"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => toast.info(`Key revocation for ${key.name} is not connected in this preview.`)}
                        aria-label={`Revoke key ${key.name}`}
                        title="Revoke key"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

