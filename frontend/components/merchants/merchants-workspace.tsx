"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import {
  defaultMerchantFilters,
  MerchantFilters,
  MerchantFiltersState,
} from "@/components/merchants/merchant-filters";
import { MerchantSummaryCards } from "@/components/merchants/merchant-summary-cards";
import { MerchantsTable } from "@/components/merchants/merchants-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Merchant } from "@/lib/types";

type MerchantsWorkspaceProps = {
  merchants: Merchant[];
};

function matchesSearch(merchant: Merchant, search: string) {
  if (!search.trim()) return true;
  const query = search.toLowerCase();
  return [merchant.name, merchant.email, merchant.id]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query));
}

function filterMerchants(merchants: Merchant[], filters: MerchantFiltersState) {
  return merchants.filter((merchant) => {
    const matchesStatus = filters.status === "all" || merchant.status === filters.status;
    const matchesRisk = filters.riskLevel === "all" || merchant.riskLevel === filters.riskLevel;
    const matchesCategory = filters.category === "all" || merchant.category === filters.category;
    const matchesLocation =
      !filters.location.trim() ||
      merchant.country.toLowerCase().includes(filters.location.toLowerCase());

    return (
      matchesSearch(merchant, filters.search) &&
      matchesStatus &&
      matchesRisk &&
      matchesCategory &&
      matchesLocation
    );
  });
}

export function MerchantsWorkspace({ merchants }: MerchantsWorkspaceProps) {
  const [filters, setFilters] = useState<MerchantFiltersState>(defaultMerchantFilters);
  const filteredMerchants = useMemo(() => filterMerchants(merchants, filters), [filters, merchants]);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "status" || key === "riskLevel" || key === "category") return value !== "all";
    return Boolean(value.trim());
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-4xl font-bold text-primary">Merchants</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Search, filter, and manage merchant onboarding, KYB status, risk, and lifecycle state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info("Saved merchant views are planned for this workspace.")}>
            <Star className="h-4 w-4" />
            Saved Views
          </Button>
          <Button variant="outline" onClick={() => toast.success("Merchant export queued for preview.")}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => toast.info("New merchant creation is not connected in this preview.")}>
            <Plus className="h-4 w-4" />
            New Merchant
          </Button>
        </div>
      </header>

      <MerchantSummaryCards merchants={merchants} />

      <MerchantFilters
        filters={filters}
        merchants={merchants}
        onChange={setFilters}
        onReset={() => setFilters(defaultMerchantFilters)}
      />

      {merchants.length === 0 ? (
        <EmptyState
          title="No merchants found"
          description="Your active environment has no merchants yet."
        />
      ) : filteredMerchants.length === 0 ? (
        <div className="glass-panel rounded-xl p-6">
          <EmptyState
            title="No matching merchants"
            description={hasActiveFilters ? "Adjust or reset filters to broaden the result set." : "No merchants are available for this view."}
          />
        </div>
      ) : (
        <MerchantsTable data={filteredMerchants} />
      )}
    </div>
  );
}

