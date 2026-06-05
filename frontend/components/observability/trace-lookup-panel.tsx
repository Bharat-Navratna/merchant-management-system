"use client";

import { useMemo, useState } from "react";
import { Search, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TraceExample } from "@/lib/types";
import { ObservabilityStatusBadge } from "@/components/observability/observability-status-badge";

export function TraceLookupPanel({ traces }: { traces: TraceExample[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return traces;
    const normalized = query.toLowerCase();
    return traces.filter((trace) =>
      [trace.requestId, trace.traceId, trace.service, trace.route]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, traces]);

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Workflow className="h-5 w-5 text-secondary" />
          Trace Lookup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Request IDs connect API responses, webhooks, audit events, and logs.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search request ID or trace ID..."
            className="pl-9"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">
          Use a request ID from audit logs, webhook deliveries, or API error responses to trace the full operational path.
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-medium">No trace examples found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different request or trace ID.</p>
            </div>
          ) : (
            filtered.map((trace) => (
              <div key={trace.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <code className="block truncate font-mono text-xs text-tertiary" title={trace.requestId}>
                      {trace.requestId}
                    </code>
                    <p className="mt-1 break-all text-sm font-semibold">{trace.route}</p>
                    <p className="break-words text-xs text-muted-foreground">{trace.service}</p>
                  </div>
                  <ObservabilityStatusBadge status={trace.status} className="shrink-0" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <code className="max-w-full truncate font-mono text-primary" title={trace.traceId}>{trace.traceId}</code>
                  <span className="font-mono">{trace.latency}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

