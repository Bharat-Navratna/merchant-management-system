import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function TopNavbar() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Fintech Operations Platform</p>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
            BN
          </div>
        </div>
      </div>
    </header>
  );
}
