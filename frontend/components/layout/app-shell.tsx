import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopNavbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
