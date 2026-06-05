"use client";

import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OperatorSession } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  OperatorSession["status"],
  { label: string; className: string; dotClass: string }
> = {
  active: {
    label: "Active",
    className: "border-success/25 bg-success/10 text-success",
    dotClass: "bg-success",
  },
  idle: {
    label: "Idle",
    className: "border-warning/25 bg-warning/10 text-warning",
    dotClass: "bg-warning",
  },
  suspicious: {
    label: "Suspicious",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dotClass: "bg-destructive animate-pulse",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
];

export function ActiveSessionsPanel({ sessions }: { sessions: OperatorSession[] }) {
  const handleRevoke = (session: OperatorSession) => {
    toast.info(`Session revocation for ${session.operator} is not connected in this preview.`);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-white/5">
        <div>
          <CardTitle className="text-xl">Active Operator Sessions</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Live operator devices with device, IP, and location context.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => toast.info("Bulk session revocation is not connected in this preview.")}
        >
          <LogOut className="h-4 w-4" />
          Revoke All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Operator</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Device / OS</th>
                <th className="px-5 py-4 font-semibold">IP Address</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Last Active</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session, idx) => {
                const statusCfg = statusConfig[session.status];
                const avatarCls = avatarColors[idx % avatarColors.length];
                return (
                  <tr key={session.id} className="hover:bg-white/[0.03]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                            avatarCls,
                          )}
                        >
                          {initials(session.operator)}
                        </span>
                        <div className="min-w-0">
                          <p className="break-words font-medium text-foreground">
                            {session.operator}
                          </p>
                          <p className="break-all text-xs text-muted-foreground" title={session.email}>
                            {session.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{session.role}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-foreground">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.os}</p>
                    </td>
                    <td className="px-5 py-4">
                      <code className="font-mono text-xs text-primary">{session.ipAddress}</code>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {session.location}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {session.lastActive}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                          statusCfg.className,
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotClass)} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRevoke(session)}
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 xl:hidden">
          {sessions.map((session, idx) => {
            const statusCfg = statusConfig[session.status];
            const avatarCls = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={session.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        avatarCls,
                      )}
                    >
                      {initials(session.operator)}
                    </span>
                    <div className="min-w-0">
                      <p className="break-words font-medium">{session.operator}</p>
                      <p className="break-words text-xs text-muted-foreground">{session.role}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      statusCfg.className,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotClass)} />
                    {statusCfg.label}
                  </span>
                </div>
                <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
                  <span>{session.device} - {session.os}</span>
                  <code className="font-mono text-primary">{session.ipAddress}</code>
                  <span>{session.location} - {session.lastActive}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRevoke(session)}
                >
                  Revoke
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

