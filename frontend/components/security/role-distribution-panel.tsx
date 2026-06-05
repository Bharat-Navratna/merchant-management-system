import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleDistributionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<RoleDistributionItem["color"], { bar: string; text: string; bg: string }> = {
  primary: { bar: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
  secondary: { bar: "bg-secondary", text: "text-secondary", bg: "bg-secondary/10" },
  tertiary: { bar: "bg-tertiary", text: "text-tertiary", bg: "bg-tertiary/10" },
  success: { bar: "bg-success", text: "text-success", bg: "bg-success/10" },
  warning: { bar: "bg-warning", text: "text-warning", bg: "bg-warning/10" },
  destructive: { bar: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
};

export function RoleDistributionPanel({ roles }: { roles: RoleDistributionItem[] }) {
  const total = roles.reduce((acc, r) => acc + r.count, 0);

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-secondary" />
          Role Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Active operator count by role across the platform.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {roles.map((role) => {
            const cfg = colorMap[role.color];
            return (
              <div
                key={role.role}
                className={cn("h-full transition-all", cfg.bar)}
                style={{ width: `${role.percentage}%` }}
                title={`${role.role}: ${role.count}`}
              />
            );
          })}
        </div>

        <div className="space-y-3">
          {roles.map((role) => {
            const cfg = colorMap[role.color];
            return (
              <div key={role.role} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", cfg.bar)} />
                    <span className="text-sm text-foreground">{role.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("font-mono text-xs font-semibold", cfg.text)}>
                      {role.count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {role.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn("h-full rounded-full", cfg.bar)}
                    style={{ width: `${role.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm">
          <span className="text-muted-foreground">Total operators</span>
          <span className="font-display text-lg font-bold text-foreground">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

