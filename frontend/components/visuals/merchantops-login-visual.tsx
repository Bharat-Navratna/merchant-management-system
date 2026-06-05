export function MerchantOpsLoginVisual() {
  return (
    <div
      aria-hidden="true"
      className="merchantops-login-visual relative h-full min-h-[390px] overflow-hidden rounded-lg border border-white/10 bg-[rgb(var(--surface-lowest))]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_24%,rgba(76,215,246,0.2),transparent_28%),radial-gradient(circle_at_78%_68%,rgba(201,143,74,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(173,198,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(173,198,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 560" fill="none">
        <defs>
          <linearGradient id="login-copper-line" x1="114" y1="95" x2="524" y2="468">
            <stop stopColor="#C98F4A" stopOpacity="0.12" />
            <stop offset="0.46" stopColor="#E7B86B" stopOpacity="0.72" />
            <stop offset="1" stopColor="#4CD7F6" stopOpacity="0.18" />
          </linearGradient>
          <filter id="login-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="merchantops-dash-drift" d="M126 143 C217 122 245 244 334 226 C428 206 439 365 522 344" stroke="url(#login-copper-line)" strokeWidth="1.4" strokeDasharray="8 12" />
        <path className="merchantops-dash-drift merchantops-delay-2" d="M122 404 C214 350 264 426 342 365 C427 298 457 242 526 253" stroke="url(#login-copper-line)" strokeWidth="1.2" strokeDasharray="7 13" />
        {[["150", "142", "#4CD7F6"], ["333", "226", "#E7B86B"], ["522", "344", "#4CD7F6"], ["202", "374", "#10B981"], ["485", "254", "#FFB4AB"]].map(([cx, cy, color], index) => (
          <circle
            key={`${cx}-${cy}`}
            className="merchantops-node-pulse"
            style={{ animationDelay: `${index * 0.55}s` }}
            cx={cx}
            cy={cy}
            r="4.5"
            fill={color}
            filter="url(#login-soft-glow)"
          />
        ))}
      </svg>

      <div className="merchantops-float absolute left-[8%] top-[12%] h-32 w-52 rounded-lg border border-cyan-200/15 bg-white/[0.07] shadow-[0_24px_80px_rgba(76,215,246,0.12)] backdrop-blur-xl">
        <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-cyan-200/20" />
        <div className="absolute left-4 top-10 h-14 w-20 rounded-md border border-white/10 bg-black/25" />
        <div className="absolute right-4 top-10 h-3 w-20 rounded-full bg-white/12" />
        <div className="absolute right-8 top-18 h-2 w-16 rounded-full bg-cyan-200/18" />
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="h-1.5 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      <div className="merchantops-float merchantops-delay-1 absolute right-[8%] top-[29%] h-40 w-60 rounded-lg border border-amber-200/15 bg-white/[0.055] shadow-[0_28px_90px_rgba(231,184,107,0.1)] backdrop-blur-xl">
        <div className="absolute left-5 top-5 h-12 w-12 rounded-full border border-cyan-200/20 bg-cyan-200/8" />
        <div className="absolute right-5 top-6 h-2 w-28 rounded-full bg-white/14" />
        <div className="absolute right-12 top-12 h-2 w-20 rounded-full bg-amber-200/22" />
        <div className="absolute bottom-5 left-5 right-5 h-16 rounded-md border border-white/10 bg-black/25">
          <div className="absolute inset-x-4 top-4 h-px bg-cyan-200/20" />
          <div className="absolute inset-x-4 top-8 h-px bg-cyan-200/14" />
          <div className="absolute inset-x-4 top-12 h-px bg-cyan-200/10" />
        </div>
      </div>

      <div className="merchantops-float merchantops-delay-2 absolute bottom-[11%] left-[15%] h-28 w-64 rounded-lg border border-emerald-200/15 bg-white/[0.06] shadow-[0_24px_80px_rgba(16,185,129,0.1)] backdrop-blur-xl">
        <div className="absolute left-5 top-5 h-2 w-24 rounded-full bg-emerald-200/22" />
        <div className="absolute left-5 top-11 h-2 w-40 rounded-full bg-white/12" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end gap-2">
          {[30, 52, 42, 70, 48, 62, 38, 56].map((height, index) => (
            <span key={index} className="w-full rounded-t-sm bg-cyan-200/20" style={{ height }} />
          ))}
        </div>
      </div>

    </div>
  );
}

