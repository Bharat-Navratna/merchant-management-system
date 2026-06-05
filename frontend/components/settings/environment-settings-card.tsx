import { Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const workerStatusConfig = {
  healthy: { label: "Healthy", className: "border-success/25 bg-success/10 text-success", dot: "bg-success" },
  degraded: { label: "Degraded", className: "border-warning/25 bg-warning/10 text-warning", dot: "bg-warning" },
  offline: { label: "Offline", className: "border-destructive/25 bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

const envConfig = {
  sandbox: { label: "Sandbox", className: "border-secondary/25 bg-secondary/10 text-secondary" },
  production: { label: "Production", className: "border-success/25 bg-success/10 text-success" },
};

export function EnvironmentSettingsCard({ env }: { env: EnvironmentSettings }) {
  const workerCfg = workerStatusConfig[env.webhookWorkerStatus];
  const envCfg = envConfig[env.environment];

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cloud className="h-4 w-4 text-tertiary" />
              Environment Settings
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Active environment, API base URL, and infrastructure status.
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
              envCfg.className,
            )}
          >
            {envCfg.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">API Base URL</p>
          <code className="block w-full truncate rounded-lg border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-primary">
            {env.apiBaseUrl}
          </code>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Frontend URL</p>
          <code className="block w-full truncate rounded-lg border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-muted-foreground">
            {env.frontendUrl}
          </code>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Webhook Worker</p>
            <p className="text-xs text-muted-foreground">{env.deploymentRegion}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
              workerCfg.className,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", workerCfg.dot)} />
            {workerCfg.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

