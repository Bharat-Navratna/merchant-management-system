import { Badge } from "@/components/ui/badge";

type Status =
  | "approved"
  | "active"
  | "success"
  | "pending"
  | "failed"
  | "rejected"
  | "retrying"
  | "suspended"
  | "verified"
  | "under review";

const statusVariantMap: Record<Status, "success" | "warning" | "destructive" | "info"> = {
  approved: "success",
  active: "success",
  success: "success",
  pending: "warning",
  failed: "destructive",
  rejected: "destructive",
  retrying: "info",
  suspended: "destructive",
  verified: "success",
  "under review": "warning",
};

export function StatusPill({ status }: { status: Status | string }) {
  const normalized = status.toLowerCase().replaceAll("_", " ") as Status;
  const variant = statusVariantMap[normalized] ?? "info";
  return <Badge variant={variant}>{status}</Badge>;
}
