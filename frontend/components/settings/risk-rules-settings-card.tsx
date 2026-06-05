"use client";

import { toast } from "sonner";
import { ShieldHalf, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskRuleSetting } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityStyles: Record<RiskRuleSetting["severity"], string> = {
  high: "border-destructive/30 bg-destructive/10 text-destructive",
  medium: "border-warning/25 bg-warning/10 text-warning",
  low: "border-success/25 bg-success/10 text-success",
};

export function RiskRulesSettingsCard({ rules }: { rules: RiskRuleSetting[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldHalf className="h-4 w-4 text-destructive" />
          Risk Rule Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Automated risk detection rules with configurable severity and thresholds.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-white/5 bg-white/[0.04] text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Rule</th>
                <th className="px-5 py-3 font-semibold">Severity</th>
                <th className="px-5 py-3 font-semibold">Threshold</th>
                <th className="px-5 py-3 font-semibold">Last Updated</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-4 font-medium text-foreground">{rule.name}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        severityStyles[rule.severity],
                      )}
                    >
                      {rule.severity}
                    </span>
                  </td>
                  <td className="max-w-[200px] px-5 py-4 text-xs text-muted-foreground">
                    {rule.threshold}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {rule.lastUpdated}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        rule.enabled
                          ? "border-success/25 bg-success/10 text-success"
                          : "border-white/10 bg-white/[0.04] text-muted-foreground",
                      )}
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast.info(`Configuration for ${rule.name} is not connected in this preview.`)
                      }
                    >
                      <Settings2 className="h-4 w-4" />
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

