"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

export default function SecurityPage() {
  const sessionsQuery = useQuery({ queryKey: ["sessions"], queryFn: api.getSecuritySessions });
  const failedLoginsQuery = useQuery({ queryKey: ["failed-logins"], queryFn: api.getFailedLogins });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">Monitor active sessions and suspicious login behavior.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {sessionsQuery.data?.map((session) => (
            <div key={session.id} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">{session.userAgent}</p>
              <p className="text-muted-foreground">{session.ip} · {session.location}</p>
              <p className="text-xs text-muted-foreground mt-1">Last active: {session.lastActive}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Failed Login Attempts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {failedLoginsQuery.data?.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{entry.email}</p>
                <p className="text-xs text-muted-foreground">{entry.ip} · attempts: {entry.attempts}</p>
              </div>
              <StatusPill status={entry.lockout ? "failed" : "pending"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
