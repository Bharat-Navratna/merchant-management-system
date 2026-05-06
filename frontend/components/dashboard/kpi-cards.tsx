import { DashboardStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total merchants", value: stats.totalMerchants },
    { label: "Active merchants", value: stats.activeMerchants },
    { label: "Pending KYB", value: stats.pendingKyb },
    { label: "Failed KYB", value: stats.failedKyb },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{card.value.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
