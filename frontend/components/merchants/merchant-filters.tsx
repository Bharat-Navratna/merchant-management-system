import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Merchant } from "@/lib/types";

export type MerchantFiltersState = {
  search: string;
  status: string;
  riskLevel: string;
  category: string;
  location: string;
  dateRange: string;
};

type MerchantFiltersProps = {
  filters: MerchantFiltersState;
  merchants: Merchant[];
  onChange: (nextFilters: MerchantFiltersState) => void;
  onReset: () => void;
};

const statusOptions = ["active", "pending", "suspended", "restricted", "failed"];
const riskOptions = ["low", "medium", "high", "critical"];

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

export const defaultMerchantFilters: MerchantFiltersState = {
  search: "",
  status: "all",
  riskLevel: "all",
  category: "all",
  location: "",
  dateRange: "",
};

export function MerchantFilters({
  filters,
  merchants,
  onChange,
  onReset,
}: MerchantFiltersProps) {
  const categories = uniqueValues(merchants.map((merchant) => merchant.category));

  const setFilter = (key: keyof MerchantFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="glass-panel rounded-xl p-4">
      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <label className="relative min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Search</span>
          <Search className="pointer-events-none absolute bottom-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Merchant name or email"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
          />
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Status</span>
          <select
            className="merchantops-focus h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground"
            value={filters.status}
            onChange={(event) => setFilter("status", event.target.value)}
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Risk Level</span>
          <select
            className="merchantops-focus h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground"
            value={filters.riskLevel}
            onChange={(event) => setFilter("riskLevel", event.target.value)}
          >
            <option value="all">All Risk Levels</option>
            {riskOptions.map((risk) => (
              <option key={risk} value={risk}>{risk}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Category</span>
          <select
            className="merchantops-focus h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-foreground"
            value={filters.category}
            onChange={(event) => setFilter("category", event.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Location</span>
          <Input
            placeholder="Country or city"
            value={filters.location}
            onChange={(event) => setFilter("location", event.target.value)}
          />
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-outline">Date Range</span>
          <Input
            placeholder="Last 30 Days"
            value={filters.dateRange}
            onChange={(event) => setFilter("dateRange", event.target.value)}
          />
        </label>

        <div className="flex items-end gap-2">
          <Button type="button" variant="outline" className="h-10 whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onReset} aria-label="Reset filters">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

