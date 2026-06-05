import { cn } from "@/lib/utils";
import { RiskNetworkInsight } from "@/lib/types";
import { riskDotClass } from "@/components/risk/risk-level-badge";

const nodePositions = [
  { top: "22%", left: "32%" },
  { top: "62%", left: "69%" },
  { top: "47%", left: "46%" },
  { top: "34%", left: "70%" },
  { top: "68%", left: "34%" },
];

export function RiskNetworkVisual({ network }: { network: RiskNetworkInsight }) {
  return (
    <div
      aria-hidden="true"
      className="merchantops-risk-visual relative mx-auto my-5 h-[230px] w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-black/20 sm:h-[260px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,215,246,0.15),transparent_38%),radial-gradient(circle_at_64%_44%,rgba(255,180,171,0.11),transparent_22%)]" />
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 sm:h-60 sm:w-60" />
      <div className="absolute left-1/2 top-1/2 h-36 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-200/12 sm:h-40 sm:w-96" />
      <div className="absolute left-1/2 top-1/2 h-72 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-200/10 sm:h-80 sm:w-32" />
      <div className="merchantops-scan-ring absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/35 sm:h-60 sm:w-60" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 290" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="risk-visual-line" x1="90" y1="46" x2="610" y2="236">
            <stop stopColor="#4CD7F6" stopOpacity="0.12" />
            <stop offset="0.48" stopColor="#4CD7F6" stopOpacity="0.76" />
            <stop offset="1" stopColor="#FFB4AB" stopOpacity="0.32" />
          </linearGradient>
          <filter id="risk-visual-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="merchantops-dash-drift" d="M112 82 C248 36 392 114 586 184" stroke="url(#risk-visual-line)" strokeWidth="1.4" strokeDasharray="10 14" />
        <path className="merchantops-dash-drift merchantops-delay-1" d="M172 204 C284 266 402 52 572 78" stroke="url(#risk-visual-line)" strokeWidth="1.2" strokeDasharray="8 13" />
        <path className="merchantops-dash-drift merchantops-delay-2" d="M132 86 C220 220 370 198 498 132" stroke="url(#risk-visual-line)" strokeWidth="1" strokeDasharray="6 12" />
        <path d="M350 26 C436 66 484 104 582 142 C482 176 430 220 350 264 C270 220 218 176 118 142 C216 104 264 66 350 26Z" stroke="#4CD7F6" strokeOpacity="0.12" />
      </svg>

      {network.hotspots.slice(0, 5).map((hotspot, index) => (
        <div
          key={hotspot.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={nodePositions[index] ?? nodePositions[0]}
        >
          <span className={cn("merchantops-node-pulse absolute h-8 w-8 rounded-full opacity-20 blur-md", riskDotClass(hotspot.level))} />
          <span className={cn("h-3.5 w-3.5 rounded-full ring-4 ring-white/10", riskDotClass(hotspot.level))} />
        </div>
      ))}

      {Array.from({ length: Math.max(0, 8 - network.hotspots.length) }).map((_, index) => (
        <span
          key={index}
          className="merchantops-node-pulse absolute h-2 w-2 rounded-full bg-cyan-200/70 shadow-[0_0_14px_rgba(76,215,246,0.45)]"
          style={{
            left: `${18 + index * 9}%`,
            top: `${34 + (index % 3) * 16}%`,
            animationDelay: `${index * 0.35}s`,
          }}
        />
      ))}

      <div className="absolute bottom-4 left-4 h-14 w-28 rounded-lg border border-white/10 bg-black/35">
        <div className="absolute left-3 top-3 h-px w-20 bg-cyan-200/20" />
        <div className="absolute left-3 top-6 h-px w-14 bg-cyan-200/16" />
        <div className="absolute left-3 top-9 h-px w-24 bg-cyan-200/12" />
      </div>
    </div>
  );
}

