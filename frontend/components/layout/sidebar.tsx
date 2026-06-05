"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  ShieldHalf,
  Store,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/services";
import { toast } from "sonner";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  aliases?: string[];
};

const primaryLinks: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/merchants", label: "Merchants", icon: Store },
  { href: "/kyb", label: "KYB Review", icon: ShieldCheck },
  { href: "/risk", label: "Risk Intelligence", icon: ShieldHalf },
  { href: "/webhooks", label: "Webhook Ops", icon: Webhook },
  { href: "/audit", label: "Audit Logs", icon: History },
  { href: "/observability", label: "Observability", icon: BarChart3 },
  { href: "/security", label: "Security", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, item: NavItem) {
  const targets = [item.href, ...(item.aliases ?? [])];
  return targets.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}

function SidebarLink({
  collapsed,
  item,
  onNavigate,
}: {
  collapsed: boolean;
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={cn(
        "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-all duration-150 active:scale-[0.98]",
        collapsed && "justify-center px-0",
        active
          ? "border-r-2 border-primary bg-white/[0.06] font-semibold text-primary shadow-[0_0_18px_rgba(173,198,255,0.08)]"
          : "hover:bg-white/[0.06] hover:text-foreground",
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
        )}
      />
      <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
    </Link>
  );
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: SidebarProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.logout();
      toast.success("Signed out successfully.");
    } catch {
      toast.success("Signed out locally.");
    } finally {
      onCloseMobile();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/10 bg-background/85 px-4 py-8 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 ease-out",
          collapsed ? "lg:w-20" : "lg:w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-72",
        )}
      >
        <div className={cn("mb-10 flex items-center gap-3 px-2", collapsed && "lg:justify-center lg:px-0")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/90 text-primary-foreground shadow-[0_0_22px_rgba(173,198,255,0.18)]">
            <span className="font-display text-lg font-black">M</span>
          </div>
          <div className={cn("min-w-0", collapsed && "lg:sr-only")}>
            <h1 className="font-display text-2xl font-bold leading-7 text-primary">
              MerchantOps
            </h1>
            <p className="mt-1 text-[11px] font-semibold uppercase leading-4 text-muted-foreground">
              Fintech Control Plane
            </p>
          </div>
          {/* <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "merchantops-focus ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground lg:flex",
              collapsed && "lg:sr-only",
            )}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button> */}
        </div>

        {/* {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="merchantops-focus mb-6 hidden h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground lg:flex"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )} */}

        <nav className="flex-1 space-y-1">
          {primaryLinks.map((item) => (
            <SidebarLink
              key={item.href}
              collapsed={collapsed}
              item={item}
              onNavigate={onCloseMobile}
            />
          ))}
        </nav>

        <div className="mt-8 border-t border-white/5 pt-6">
          <button
            type="button"
            onClick={() => toast.info("Environment switching will be available when multiple environments are connected.")}
            className={cn(
              "merchantops-focus mb-5 flex h-11 w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15",
              collapsed && "lg:justify-center lg:px-0",
            )}
            title={collapsed ? "Sandbox/Production" : undefined}
            aria-label="Switch environment"
          >
            <span className={cn("truncate", collapsed && "lg:sr-only")}>Sandbox/Production</span>
            <span className="flex items-center">
              <ChevronLeft className="h-3.5 w-3.5" />
              <ChevronRight className="h-3.5 w-3.5 -ml-1" />
            </span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "merchantops-focus flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0",
            )}
            title={collapsed ? "Logout" : undefined}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", collapsed && "lg:sr-only")}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

