"use client";

import { toast } from "sonner";
import { AlertTriangle, Download, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    id: "disable-env",
    icon: XCircle,
    title: "Disable Environment",
    description:
      "Temporarily disable the current Sandbox environment and suspend all active webhooks and API access.",
    label: "Disable Environment",
  },
  {
    id: "export-data",
    icon: Download,
    title: "Export Workspace Data",
    description:
      "Request a full data export of merchants, audit logs, KYB records, and webhook history as a compressed archive.",
    label: "Request Data Export",
  },
  {
    id: "delete-workspace",
    icon: Trash2,
    title: "Delete Workspace",
    description:
      "Permanently delete this workspace and all associated data. This action is irreversible and requires confirmation from all Super Admins.",
    label: "Delete Workspace",
  },
];

export function DangerZoneCard() {
  return (
    <Card className="overflow-hidden border-destructive/20">
      <CardHeader className="border-b border-destructive/15 bg-destructive/5">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Destructive and irreversible actions are disabled in this preview. No backend
          writes are performed.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-xl border border-destructive/15 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{action.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                disabled
                onClick={() => toast.info(`${action.title} is disabled in this preview. No action taken.`)}
              >
                {action.label}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

