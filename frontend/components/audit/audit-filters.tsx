import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuditLog } from "@/lib/types";

export type AuditFiltersState = {
  search: string;
  actor: string;
  action: string;
  entityType: string;
  severity: string;
  dateRange: string;
};

type AuditFiltersProps = {
  filters: AuditFiltersState;
  events: AuditLog[];
  onChange: (filters: AuditFiltersState) => void;
  onReset: () => void;
};

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

export function AuditFilters({ filters, events, onChange, onReset }: AuditFiltersProps) {
  const actors = unique(events.map((event) => event.actor));
  const actions = unique(events.map((event) => event.action));
  const entityTypes = unique(events.map((event) => event.entityType));

  const update = (key: keyof AuditFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_repeat(5,minmax(140px,1fr))_auto] xl:items-end">
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Search
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => update("search", event.target.value)}
              placeholder="Actor, action, entity, request ID..."
              className="pl-9"
            />
          </div>
        </label>

        <FilterSelect
          label="Actor"
          value={filters.actor}
          onChange={(value) => update("actor", value)}
          options={actors}
        />
        <FilterSelect
          label="Action"
          value={filters.action}
          onChange={(value) => update("action", value)}
          options={actions}
        />
        <FilterSelect
          label="Entity Type"
          value={filters.entityType}
          onChange={(value) => update("entityType", value)}
          options={entityTypes}
        />
        <FilterSelect
          label="Severity"
          value={filters.severity}
          onChange={(value) => update("severity", value)}
          options={["high", "medium", "low"]}
        />
        <FilterSelect
          label="Date Range"
          value={filters.dateRange}
          onChange={(value) => update("dateRange", value)}
          options={["Last 24 hours", "Last 7 days", "Last 30 days", "Custom range"]}
        />

        <Button variant="outline" onClick={onReset} className="md:col-span-2 xl:col-span-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

