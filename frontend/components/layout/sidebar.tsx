"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, ShieldCheck, Webhook, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/merchants", label: "Merchants", icon: Store },
  { href: "/kyb", label: "KYB", icon: ShieldCheck },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/security", label: "Security", icon: Lock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 h-screen border-r border-border bg-card p-4 sticky top-0">
      <div className="w-full space-y-6">
        <div className="px-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Fintech Admin</p>
          <h1 className="text-xl font-semibold">Merchant Console</h1>
        </div>
        <nav className="space-y-1">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
