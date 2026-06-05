"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TopNavbarProps = {
  isSidebarCollapsed: boolean;
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
};

const searchPlaceholders: Record<string, string> = {
  "/dashboard": "Search merchants, transactions, or logs...",
  "/merchants": "Search merchants, IDs, or webhooks...",
  "/kyb": "Search KYB cases, documents, or reviewers...",
  "/risk": "Search merchants, risk rules, or alerts...",
  "/webhooks": "Search delivery ID, URL or merchant...",
  "/audit": "Search system logs...",
  "/observability": "Search systems...",
  "/security": "Search security logs...",
  "/settings": "Search settings...",
};

function getSearchPlaceholder(pathname: string) {
  const match = Object.entries(searchPlaceholders).find(([route]) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  return match?.[1] ?? "Search merchants, IDs, or webhooks...";
}

export function TopNavbar({
  isSidebarCollapsed,
  onOpenMobileSidebar,
  onToggleSidebar,
}: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="merchantops-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="merchantops-focus hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground lg:flex"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
          <div className="relative hidden w-full max-w-[30rem] sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
            <input
              className="merchantops-focus h-10 w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-outline transition-shadow"
              placeholder={getSearchPlaceholder(pathname)}
              type="search"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            className="hidden h-10 px-4 font-display text-xs font-bold sm:inline-flex"
            onClick={() => toast.info("Merchant creation will open here once onboarding forms are connected.")}
          >
            <Plus className="h-4 w-4" />
            New Merchant
          </Button>
          <div className="mx-1 hidden h-8 w-px bg-white/10 sm:block" />
          <button
            type="button"
            className="merchantops-focus relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            aria-label="Notifications"
            onClick={() => toast.info("No new notifications. Alerts will appear here as events arrive.")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-background bg-destructive" />
          </button>
          <button
            type="button"
            className="merchantops-focus hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground sm:flex"
            aria-label="Settings"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-5 w-5" />
          </button>
          <div
            className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-surface-high text-xs font-bold text-primary shadow-[0_0_18px_rgba(76,215,246,0.12)]"
            aria-label="Signed in as BN"
            role="img"
          >
            BN
          </div>
        </div>
      </div>
    </header>
  );
}

