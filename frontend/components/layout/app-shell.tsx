"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("merchantops-sidebar-collapsed") === "true";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((current) => {
      const next = !current;
      localStorage.setItem("merchantops-sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="merchantops-grid-bg min-h-screen overflow-x-hidden text-foreground">
      <Sidebar
        collapsed={isSidebarCollapsed}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleCollapse={toggleSidebar}
      />
      <div
        className={cn(
          "min-h-screen min-w-0 transition-[padding] duration-300 ease-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <TopNavbar
          isSidebarCollapsed={isSidebarCollapsed}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={toggleSidebar}
        />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}

