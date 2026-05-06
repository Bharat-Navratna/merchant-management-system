import {
  Activity,
  DashboardStats,
  FailedLogin,
  KybDocument,
  Merchant,
  SecuritySession,
  WebhookEvent,
} from "@/lib/types";

export const dashboardStats: DashboardStats = {
  totalMerchants: 1248,
  activeMerchants: 1022,
  pendingKyb: 147,
  failedKyb: 79,
  webhookSuccess: 9345,
  webhookFailed: 182,
};

export const activities: Activity[] = [
  { id: "a1", actor: "Ops Team", action: "Approved KYB for Nova Retail", timestamp: "2 mins ago" },
  { id: "a2", actor: "Webhook Worker", action: "Retried payout.failed event", timestamp: "10 mins ago" },
  { id: "a3", actor: "Risk Team", action: "Rejected KYB for Orbit Ventures", timestamp: "24 mins ago" },
  { id: "a4", actor: "Admin", action: "Logged in from new device", timestamp: "40 mins ago" },
];

export const merchants: Merchant[] = [
  { id: "m1", name: "Nova Retail", status: "active", kybStatus: "approved", createdAt: "2026-04-10", country: "US", email: "ops@novaretail.com" },
  { id: "m2", name: "Orbit Ventures", status: "failed", kybStatus: "rejected", createdAt: "2026-04-04", country: "UK", email: "finance@orbit.com" },
  { id: "m3", name: "Lumen Foods", status: "pending", kybStatus: "under review", createdAt: "2026-04-17", country: "IN", email: "admin@lumenfoods.in" },
  { id: "m4", name: "Astra Health", status: "active", kybStatus: "approved", createdAt: "2026-03-30", country: "SG", email: "ops@astrahealth.sg" },
  { id: "m5", name: "Pulse Mobility", status: "pending", kybStatus: "pending", createdAt: "2026-04-20", country: "AE", email: "kyb@pulsemobility.ae" },
];

export const kybDocuments: KybDocument[] = [
  { id: "d1", name: "Certificate of Incorporation", status: "verified" },
  { id: "d2", name: "Tax Registration", status: "verified" },
  { id: "d3", name: "Director Identity Proof", status: "pending" },
];

export const webhookEvents: WebhookEvent[] = [
  { id: "w1", eventType: "merchant.kyb.approved", status: "success", retryCount: 0, timestamp: "2026-04-29T11:05:00Z" },
  { id: "w2", eventType: "merchant.kyb.rejected", status: "failed", retryCount: 2, timestamp: "2026-04-29T10:45:00Z" },
  { id: "w3", eventType: "payout.failed", status: "retrying", retryCount: 1, timestamp: "2026-04-29T10:10:00Z" },
];

export const sessions: SecuritySession[] = [
  { id: "s1", ip: "192.168.0.10", userAgent: "Chrome on Windows", location: "Mumbai, IN", lastActive: "1 min ago" },
  { id: "s2", ip: "172.16.0.33", userAgent: "Safari on macOS", location: "London, UK", lastActive: "9 mins ago" },
];

export const failedLogins: FailedLogin[] = [
  { id: "f1", email: "unknown@riskmail.com", ip: "185.32.10.90", attempts: 5, lockout: true, timestamp: "2026-04-29 10:33" },
  { id: "f2", email: "ops@novaretail.com", ip: "180.150.11.18", attempts: 2, lockout: false, timestamp: "2026-04-29 09:11" },
];
