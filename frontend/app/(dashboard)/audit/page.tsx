"use client";

import { useMemo, useState } from "react";
import { Download, FileClock } from "lucide-react";
import { toast } from "sonner";
import { AuditEventDetail } from "@/components/audit/audit-event-detail";
import { AuditEventStream } from "@/components/audit/audit-event-stream";
import { AuditEventTable } from "@/components/audit/audit-event-table";
import { AuditFilters, AuditFiltersState } from "@/components/audit/audit-filters";
import { AuditSummaryCards } from "@/components/audit/audit-summary-cards";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";
import { AuditLog } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const defaultFilters: AuditFiltersState = {
  search: "",
  actor: "",
  action: "",
  entityType: "",
  severity: "",
  dateRange: "",
};

function AuditPageSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Skeleton className="min-h-[420px] w-full rounded-xl" />
        <Skeleton className="min-h-[420px] w-full rounded-xl" />
      </div>
    </div>
  );
}

function matchesFilter(event: AuditLog, filters: AuditFiltersState) {
  const search = filters.search.trim().toLowerCase();
  if (search) {
    const searchable = [
      event.actor,
      event.actorRole,
      event.action,
      event.entity,
      event.entityId,
      event.entityType,
      event.ipAddress,
      event.requestId,
      event.correlationId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!searchable.includes(search)) return false;
  }

  if (filters.actor && event.actor !== filters.actor) return false;
  if (filters.action && event.action !== filters.action) return false;
  if (filters.entityType && event.entityType !== filters.entityType) return false;
  if (filters.severity && event.severity !== filters.severity) return false;

  return true;
}

export default function AuditPage() {
  const [filters, setFilters] = useState<AuditFiltersState>(defaultFilters);
  const [selectedEventId, setSelectedEventId] = useState<string | null>();

  const auditQuery = useQuery({
    queryKey: ["audit-log-data"],
    queryFn: api.getAuditLogData,
  });

  const events = useMemo(() => auditQuery.data?.events ?? [], [auditQuery.data?.events]);
  const filteredEvents = useMemo(
    () => events.filter((event) => matchesFilter(event, filters)),
    [events, filters],
  );

  const activeEventId = selectedEventId === undefined ? filteredEvents[0]?.id ?? null : selectedEventId;
  const selectedEvent = activeEventId
    ? filteredEvents.find((event) => event.id === activeEventId) ?? null
    : null;

  if (auditQuery.isLoading) {
    return <AuditPageSkeleton />;
  }

  if (auditQuery.isError || !auditQuery.data) {
    return (
      <EmptyState
        title="Unable to load audit logs"
        description="Compliance event data could not be loaded. Please try again shortly."
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No audit events recorded"
        description="Immutable operational events will appear here once operators, workers, and APIs emit audit records."
      />
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <FileClock className="h-3.5 w-3.5" />
            Tamper-evident operational stream
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Audit Logs</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Search immutable operational events across merchants, KYB reviews, webhooks, security, and operator actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info("Retention policy details are not connected in this preview.")}
          >
            <FileClock className="h-4 w-4" />
            Retention Policy
          </Button>
          <Button onClick={() => toast.success("Audit export queued for preview.")}>
            <Download className="h-4 w-4" />
            Export Audit Log
          </Button>
        </div>
      </header>

      <AuditSummaryCards stats={auditQuery.data.stats} />

      <AuditFilters
        filters={filters}
        events={events}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-5">
          <AuditEventTable
            events={filteredEvents}
            selectedId={activeEventId ?? undefined}
            onSelect={(event) => setSelectedEventId(event.id)}
          />
        </div>

        <aside className="min-w-0 space-y-5">
          <AuditEventDetail
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
          />
          <AuditEventStream stream={auditQuery.data.stream} />
        </aside>
      </div>
    </div>
  );
}

