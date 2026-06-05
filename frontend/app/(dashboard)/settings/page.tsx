"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  Cloud,
  History,
  KeyRound,
  Save,
  Settings,
  ShieldCheck,
  ShieldHalf,
  AlertTriangle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ApiKeysSettingsCard } from "@/components/settings/api-keys-settings-card";
import { DangerZoneCard } from "@/components/settings/danger-zone-card";
import { EnvironmentSettingsCard } from "@/components/settings/environment-settings-card";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { OrganizationSettingsCard } from "@/components/settings/organization-settings-card";
import { RiskRulesSettingsCard } from "@/components/settings/risk-rules-settings-card";
import { RolesPermissionsCard } from "@/components/settings/roles-permissions-card";
import { WebhookSigningSettingsCard } from "@/components/settings/webhook-signing-settings-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/services";
import { cn } from "@/lib/utils";

type SectionId =
  | "organization"
  | "environment"
  | "roles"
  | "webhook-signing"
  | "risk-rules"
  | "api-keys"
  | "notifications"
  | "danger-zone";

const sections: {
  id: SectionId;
  label: string;
  icon: typeof Settings;
  danger?: boolean;
}[] = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "environment", label: "Environment", icon: Cloud },
  { id: "roles", label: "Roles & Permissions", icon: Users },
  { id: "webhook-signing", label: "Webhook Signing", icon: ShieldCheck },
  { id: "risk-rules", label: "Risk Rules", icon: ShieldHalf },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

function SettingsPageSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-5">
        <Skeleton className="h-96 w-56 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-5">
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("organization");

  const settingsQuery = useQuery({
    queryKey: ["settings-data"],
    queryFn: api.getSettingsData,
  });

  if (settingsQuery.isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <EmptyState
        title="Unable to load settings"
        description="Platform configuration could not be loaded. Please try again shortly."
      />
    );
  }

  const data = settingsQuery.data;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Settings className="h-3.5 w-3.5" />
            Organization &amp; developer configuration
          </div>
          <h2 className="font-display text-4xl font-bold text-primary">Settings</h2>
          <p className="mt-2 max-w-4xl text-base text-muted-foreground">
            Configure organization, environments, access controls, webhooks, risk rules, and
            developer options.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info("Navigate to Audit Logs to view the settings change history.")}
          >
            <History className="h-4 w-4" />
            View Audit Trail
          </Button>
          <Button onClick={() => toast.success("Settings saved for this preview.")}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Categories
              </p>
            </div>
            <nav className="space-y-0.5 p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                      isActive
                        ? section.danger
                          ? "border-l-2 border-destructive bg-destructive/10 font-semibold text-destructive"
                          : "border-l-2 border-primary bg-primary/10 font-semibold text-primary"
                        : section.danger
                          ? "text-destructive hover:bg-destructive/10"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      section.danger && !isActive && "mt-2 border-t border-white/5 pt-2",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 leading-snug">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="glass-panel mt-4 rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground">API Consumption</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Current key usage is at 42% of monthly quota.
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div className="h-full w-[42%] rounded-full bg-primary" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          {activeSection === "organization" && (
            <OrganizationSettingsCard org={data.organization} />
          )}
          {activeSection === "environment" && (
            <EnvironmentSettingsCard env={data.environment} />
          )}
          {activeSection === "roles" && (
            <RolesPermissionsCard data={data.rolesPermissions} />
          )}
          {activeSection === "webhook-signing" && (
            <WebhookSigningSettingsCard settings={data.webhookSigning} />
          )}
          {activeSection === "risk-rules" && (
            <RiskRulesSettingsCard rules={data.riskRules} />
          )}
          {activeSection === "api-keys" && (
            <ApiKeysSettingsCard apiKeys={data.apiKeys} />
          )}
          {activeSection === "notifications" && (
            <NotificationPreferencesCard preferences={data.notifications} />
          )}
          {activeSection === "danger-zone" && <DangerZoneCard />}
        </div>
      </div>
    </div>
  );
}

