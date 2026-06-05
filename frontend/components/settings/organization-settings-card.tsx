"use client";

import { Building2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrgSettings } from "@/lib/types";

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <p className="shrink-0 text-sm text-muted-foreground">{label}</p>
      <p className="min-w-0 break-words text-right text-sm font-medium text-foreground" title={value}>
        {value}
      </p>
    </div>
  );
}

export function OrganizationSettingsCard({ org }: { org: OrgSettings }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4 text-primary" />
          Organization Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Workspace identity, region, and contact configuration.
        </p>
      </CardHeader>
      <CardContent className="p-5">
        <SettingRow label="Organization Name" value={org.name} />
        <SettingRow label="Workspace Slug" value={org.slug} />
        <SettingRow label="Deployment Region" value={org.region} />
        <SettingRow label="Timezone" value={org.timezone} />
        <SettingRow label="Support Email" value={org.supportEmail} />
        <div className="mt-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Organization settings are read-only in this preview.")}
          >
            <Save className="h-3.5 w-3.5" />
            Edit Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

