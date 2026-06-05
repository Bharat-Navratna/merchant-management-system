import { Network, Radar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RiskNetworkInsight } from "@/lib/types";
import { RiskNetworkVisual } from "@/components/visuals/risk-network-visual";

export function RiskNetworkPanel({ network }: { network: RiskNetworkInsight }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(173,198,255,0.14),transparent_34%),radial-gradient(circle_at_70%_62%,rgba(255,180,171,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(173,198,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(173,198,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex flex-col justify-between p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Network className="h-3.5 w-3.5" />
              CSS/SVG risk network
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground">Merchant Risk Network</h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Lightweight visual for merchant clusters, connected signals, and risk hotspots.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="rounded-lg border border-white/10 bg-black/35 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">Active Sensors</p>
              <p className="font-mono text-lg text-tertiary">{network.activeSensors.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/35 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">Threat Level</p>
              <p className="font-mono text-lg capitalize text-warning">{network.threatLevel}</p>
            </div>
          </div>
        </div>

        <RiskNetworkVisual network={network} />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Radar className="h-4 w-4 text-tertiary" />
            CSS/SVG visual replaces the planned Spline scene.
          </span>
          <span>Lightweight animation keeps dashboard data render non-blocking.</span>
        </div>
      </div>
    </Card>
  );
}

