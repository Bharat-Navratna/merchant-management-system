import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentAlert } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const severityStyles: Record<IncidentAlert["severity"], string> = {
  low: "border-success/25 bg-success/10 text-success",
  medium: "border-warning/25 bg-warning/10 text-warning",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
  critical: "border-destructive/40 bg-destructive/15 text-destructive",
};

function formatStarted(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IncidentAlertsPanel({ incidents }: { incidents: IncidentAlert[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Incident Alerts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Active and recent platform reliability alerts.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {incidents.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="font-medium">No active incidents</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Alerts will appear here when a component breaches its SLO.
            </p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-semibold">{incident.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{incident.affectedComponent}</p>
                </div>
                <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", severityStyles[incident.severity])}>
                  {incident.severity}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                <span>Started {formatStarted(incident.startedAt)}</span>
                <span className="capitalize">Status: {incident.status}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => toast.info(`${incident.action} is not connected in this preview.`)}
              >
                {incident.action}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

