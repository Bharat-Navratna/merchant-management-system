"use client";

import { AlertCircle, CheckCircle2, GitBranch, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebhookReliabilityPanel() {
  const steps = [
    {
      icon: GitBranch,
      title: "Status Change",
      description: "Merchant lifecycle changes enqueue signed webhook events.",
      color: "text-primary",
    },
    {
      icon: Zap,
      title: "Worker Delivery",
      description: "A background worker delivers events asynchronously.",
      color: "text-secondary",
    },
    {
      icon: CheckCircle2,
      title: "Retry Backoff",
      description: "Failed deliveries retry automatically before escalation.",
      color: "text-success",
    },
    {
      icon: AlertCircle,
      title: "Dead Letter",
      description: "Exhausted events require operator review and replay.",
      color: "text-destructive",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">Webhook Reliability Architecture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-0.5 w-4 bg-gradient-to-r from-white/20 to-transparent xl:block" />
                )}
                <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
                  <Icon className={`h-5 w-5 ${step.color}`} />
                  <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
          <p className="text-xs text-primary">
            Status changes enqueue webhook events, workers deliver them without blocking operators,
            failed requests retry, and dead-lettered events wait for manual replay.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

