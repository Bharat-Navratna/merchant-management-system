export interface DashboardStats {
  totalMerchants: number;
  activeMerchants: number;
  pendingKyb: number;
  failedKyb: number;
  webhookSuccess: number;
  webhookFailed: number;
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface Merchant {
  id: string;
  name: string;
  status: "active" | "pending" | "failed";
  kybStatus: "pending" | "under review" | "approved" | "rejected";
  createdAt: string;
  country: string;
  email: string;
}

export interface KybDocument {
  id: string;
  name: string;
  status: "verified" | "pending" | "rejected";
}

export interface WebhookEvent {
  id: string;
  eventType: string;
  status: "success" | "failed" | "retrying";
  retryCount: number;
  timestamp: string;
}

export interface SecuritySession {
  id: string;
  ip: string;
  userAgent: string;
  location: string;
  lastActive: string;
}

export interface FailedLogin {
  id: string;
  email: string;
  ip: string;
  attempts: number;
  lockout: boolean;
  timestamp: string;
}
