"use client";

import type { ComponentType } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  HeartPulse,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
  Store,
  Timer,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandCenterDashboard as CommandCenterDashboardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DashboardProps = {
  data: CommandCenterDashboardData;
};

const metricIcons: Record<string, ComponentType<{ className?: string }>> = {
  "total-merchants": Store,
  "pending-kyb": ShieldCheck,
  "active-merchants": CheckCircle2,
  "high-risk-reviews": ShieldAlert,
  "webhook-success": Zap,
  "failed-deliveries": AlertTriangle,
  "average-approval": Timer,
  "system-health": HeartPulse,
};

const toneClass = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

const toneGlow = {
  primary: "bg-primary/5",
  secondary: "bg-secondary/5",
  tertiary: "bg-tertiary/5",
  success: "bg-success/5",
  warning: "bg-warning/5",
  danger: "bg-destructive/5",
};

const riskBadge = {
  Low: "border-tertiary/30 bg-tertiary/10 text-tertiary",
  Medium: "border-primary/30 bg-primary/10 text-primary",
  High: "border-destructive/30 bg-destructive/10 text-destructive",
  Critical: "border-destructive/40 bg-destructive/15 text-destructive",
};

const healthDot = {
  healthy: "bg-success",
  degraded: "bg-warning",
  critical: "bg-destructive",
  down: "bg-destructive",
};

function MetricCard({
  metric,
}: {
  metric: CommandCenterDashboardData["metrics"][number];
}) {
  const Icon = metricIcons[metric.id] ?? Gauge;

  return (
    <Card className="relative overflow-hidden p-0">
      <CardContent className="relative z-10 p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {metric.label}
          </p>
          <Icon className={cn("h-5 w-5 opacity-70", toneClass[metric.tone])} />
        </div>
        <p
          className={cn(
            "font-display text-4xl font-bold leading-none sm:text-5xl",
            toneClass[metric.tone],
          )}
        >
          {metric.value}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {metric.detail}
        </p>
      </CardContent>
      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-28 w-28 rounded-full blur-3xl",
          toneGlow[metric.tone],
        )}
      />
    </Card>
  );
}

function OnboardingPipeline({
  stages,
}: {
  stages: CommandCenterDashboardData["pipeline"];
}) {
  return (
    <Card className="lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-2xl">Merchant Onboarding Pipeline</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info(
              "Pipeline details are available in the KYB Review workspace.",
            )
          }
        >
          Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-4 sm:grid-cols-5">
          <div className="absolute left-8 right-8 top-8 hidden h-px bg-white/10 sm:block" />
          <div className="absolute left-8 right-[20%] top-8 hidden h-px bg-primary/40 sm:block" />
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="relative flex min-w-0 flex-row items-center gap-3 sm:flex-col sm:items-center sm:text-center"
            >
              <div
                className={cn(
                  "z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-surface-high font-display text-xl font-bold shadow-[0_0_24px_rgba(0,0,0,0.22)]",
                  stage.status === "healthy" &&
                    "border-primary text-primary shadow-[0_0_22px_rgba(173,198,255,0.18)]",
                  stage.status === "watch" && "border-warning/50 text-warning",
                  stage.status === "risk" &&
                    "border-destructive/50 text-destructive",
                  stage.status === "neutral" &&
                    "border-white/15 text-foreground",
                )}
              >
                {stage.count}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{stage.label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {stage.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function KybReviewQueue({
  items,
}: {
  items: CommandCenterDashboardData["kybQueue"];
}) {
  return (
    <Card className="overflow-hidden lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-white/5">
        <CardTitle className="text-2xl">Priority KYB Review Queue</CardTitle>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {items.length} live cases
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Merchant</th>
                <th className="px-6 py-4 font-semibold">Documents</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">SLA Timer</th>
                <th className="px-6 py-4 font-semibold">Reviewer</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03]">
                  <td className="max-w-[220px] px-6 py-4">
                    <p className="break-words font-medium">
                      {item.merchantName}
                    </p>
                    <p
                      className="truncate text-xs text-muted-foreground"
                      title={item.id.toUpperCase()}
                    >
                      ID: {item.id.toUpperCase()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {item.submittedDocuments}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        riskBadge[item.riskLevel],
                      )}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 font-medium",
                      item.riskLevel === "High" || item.riskLevel === "Critical"
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {item.slaTimer}
                  </td>
                  <td className="max-w-[160px] px-6 py-4">
                    <span
                      className={cn(
                        "block break-words",
                        item.reviewer === "Unassigned" &&
                          "italic text-muted-foreground",
                      )}
                    >
                      {item.reviewer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info(
                          `${item.action} is available from the KYB Review queue.`,
                        )
                      }
                    >
                      {item.action}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskIntelligence({ data }: { data: CommandCenterDashboardData }) {
  const { low, medium, high } = data.riskDistribution;

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl">Risk Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center">
          <div
            className="relative flex h-44 w-44 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(rgb(var(--tertiary)) 0 ${low}%, rgb(var(--primary)) ${low}% ${low + medium}%, rgb(var(--destructive)) ${low + medium}% 100%)`,
            }}
          >
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-surface text-center shadow-inner">
              <span className="font-display text-2xl font-semibold">
                Stable
              </span>
              <span className="text-xs text-muted-foreground">System-wide</span>
            </div>
          </div>
          <div className="mt-4 grid w-full grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-xs text-tertiary">Low</p>
              <p>{low}%</p>
            </div>
            <div>
              <p className="text-xs text-primary">Med</p>
              <p>{medium}%</p>
            </div>
            <div>
              <p className="text-xs text-destructive">High</p>
              <p>{high}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.highRiskMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="break-words font-medium">
                  {merchant.merchantName}
                </p>
                <span className="font-display text-xl font-semibold text-destructive">
                  {merchant.score}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {merchant.reason}
              </p>
              <p className="mt-2 text-xs text-primary">{merchant.action}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WebhookHealth({
  data,
}: {
  data: CommandCenterDashboardData["webhookHealth"];
}) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl">Webhook Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-muted-foreground">Delivery Rate</p>
            <p className="font-display text-3xl font-semibold text-tertiary">
              {data.deliverySuccessRate}
            </p>
          </div>
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-muted-foreground">Pending Retries</p>
            <p className="font-display text-3xl font-semibold text-primary">
              {data.pendingRetries}
            </p>
          </div>
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-muted-foreground">Failed</p>
            <p className="font-display text-3xl font-semibold text-destructive">
              {data.failedDeliveries}
            </p>
          </div>
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-muted-foreground">Dead-letter</p>
            <p className="font-display text-3xl font-semibold text-warning">
              {data.deadLetterEvents}
            </p>
          </div>
        </div>

        <div className="space-y-7">
          {data.endpointHealth.map((endpoint) => (
            <div
              key={endpoint.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-medium"
                  title={endpoint.endpoint}
                >
                  {endpoint.endpoint}
                </p>
                <p className="text-xs text-muted-foreground">
                  {endpoint.latency}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-2 text-xs capitalize text-muted-foreground">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    healthDot[endpoint.status],
                  )}
                />
                {endpoint.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentAuditActivity({
  rows,
}: {
  rows: CommandCenterDashboardData["auditActivity"];
}) {
  return (
    <Card className="lg:col-span-8">
      <CardHeader>
        <CardTitle className="text-2xl">Recent Audit Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm md:grid-cols-[1.1fr_1.2fr_1fr_0.8fr_1fr]"
          >
            <p className="break-words font-medium">{row.operator}</p>
            <p className="break-words text-primary">{row.action}</p>
            <p className="break-words text-muted-foreground">{row.entity}</p>
            <p className="text-muted-foreground">{row.timestamp}</p>
            <code
              className="truncate font-mono text-xs text-tertiary"
              title={row.requestId}
            >
              {row.requestId}
            </code>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OperationalSignals() {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl">Operational Signals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-tertiary/20 bg-tertiary/10 p-3">
          <RadioTower className="mt-0.5 h-5 w-5 shrink-0 text-tertiary" />
          <div className="min-w-0">
            <p className="font-medium text-tertiary">Webhook network stable</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All primary endpoints responding inside SLA.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="font-medium text-primary">Database connected</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Read/write path healthy for operations screens.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/10 p-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="min-w-0">
            <p className="font-medium text-warning">Queue watch</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              142 webhook retries pending worker pickup.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SystemHealthStrip({
  items,
  className,
}: {
  items: CommandCenterDashboardData["systemHealth"];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col gap-4 rounded-xl px-5 py-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-sm font-semibold uppercase text-tertiary">
        <span className="h-2.5 w-2.5 rounded-full bg-tertiary shadow-[0_0_12px_rgba(76,215,246,0.8)]" />
        System Health: Optimal
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.id} className="min-w-0">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={cn("h-2 w-2 rounded-full", healthDot[item.status])}
              />
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommandCenterDashboard({ data }: DashboardProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-4xl font-bold text-primary">
          Command Center
        </h2>
        <p className="mt-2 max-w-4xl text-base text-muted-foreground">
          Monitor merchant onboarding, KYB verification, risk, webhooks, and
          platform health.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid items-start gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <OnboardingPipeline stages={data.pipeline} />
          <KybReviewQueue items={data.kybQueue} />
          <RecentAuditActivity rows={data.auditActivity} />
          <OperationalSignals />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <RiskIntelligence data={data} />
          <WebhookHealth data={data.webhookHealth} />
          {/* <OperationalSignals /> */}
        </div>
      </section>

      <SystemHealthStrip items={data.systemHealth} />
    </div>
  );
}
