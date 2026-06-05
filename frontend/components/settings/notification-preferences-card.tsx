"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationPreference } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NotificationPreferencesCard({
  preferences,
}: {
  preferences: NotificationPreference[];
}) {
  const [prefs, setPrefs] = useState(preferences);

  const toggle = (id: string) => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          Notification Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure which platform events trigger operator alerts.
        </p>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {prefs.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{pref.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pref.enabled}
              aria-label={`${pref.enabled ? "Disable" : "Enable"} ${pref.label}`}
              onClick={() => toggle(pref.id)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                pref.enabled ? "bg-primary" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  pref.enabled && "translate-x-4",
                )}
              />
            </button>
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            onClick={() => toast.success("Notification preferences saved for this preview.")}
          >
            <Save className="h-3.5 w-3.5" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

