"use client";

import { useState } from "react";
import { Scale, ChevronDown, Info, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type KybDecision = "approve" | "reject" | "resubmit" | null;

export interface KybDecisionPayload {
  decision: KybDecision;
  reason: string;
  notes: string;
}

const REJECTION_REASONS = [
  "Select a reason...",
  "Standard Approval",
  "Document Quality Issues",
  "Incomplete UBO Information",
  "High Risk Jurisdiction",
  "Sanctions / PEP Match",
  "Identity Verification Failed",
  "Address Mismatch",
  "Expired Documents",
  "Insufficient Bank Evidence",
  "Other - see notes",
] as const;

function NativeSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg text-sm text-foreground py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1d2027]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

interface KybDecisionPanelProps {
  merchantName: string;
  onSubmit?: (payload: KybDecisionPayload) => void;
  isSubmitting?: boolean;
}

export function KybDecisionPanel({
  merchantName,
  onSubmit,
  isSubmitting,
}: KybDecisionPanelProps) {
  const [decision, setDecision] = useState<KybDecision>(null);
  const [reason, setReason] = useState<string>(REJECTION_REASONS[0]);
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    if (!decision) return;
    onSubmit?.({ decision, reason, notes });
  }

  const DECISION_BUTTONS: {
    key: KybDecision;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    cls: string;
    activeCls: string;
  }[] = [
    {
      key: "approve",
      label: "APPROVE",
      icon: CheckCircle2,
      cls: "border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10",
      activeCls: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.15)]",
    },
    {
      key: "reject",
      label: "REJECT",
      icon: XCircle,
      cls: "border border-destructive/20 text-destructive hover:bg-destructive/10",
      activeCls: "bg-destructive/20 border-destructive/40 text-destructive shadow-[0_0_14px_rgba(255,180,171,0.15)]",
    },
    {
      key: "resubmit",
      label: "RESUBMIT",
      icon: RotateCcw,
      cls: "border border-white/10 text-muted-foreground hover:bg-white/[0.05]",
      activeCls: "bg-white/10 border-white/20 text-foreground",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Scale className="size-4 text-primary" />
          Decision
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {DECISION_BUTTONS.map(({ key, label, icon: Icon, cls, activeCls }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDecision(decision === key ? null : key)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[11px] font-bold tracking-wider transition-all",
                decision === key ? activeCls : cn("bg-white/3", cls),
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <NativeSelect
          label="Decision Reasoning"
          value={reason}
          onChange={setReason}
          options={REJECTION_REASONS}
        />

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Reviewer Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add context for this decision..."
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/3 border border-white/[0.07]">
          <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            This decision will be written to the{" "}
            <span className="text-foreground/70 font-medium">audit trail</span> and cannot
            be undone without a supervisor override for{" "}
            <span className="font-medium text-foreground/70">{merchantName}</span>.
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!decision || isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : decision
            ? `Submit - ${decision.charAt(0).toUpperCase() + decision.slice(1)}`
            : "Select a decision above"}
        </Button>
      </CardContent>
    </Card>
  );
}

