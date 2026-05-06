import { apiClient } from "@/lib/api/client";
import { activities, failedLogins, sessions, webhookEvents } from "@/lib/mock-data";
import { DashboardStats, KybDocument, Merchant, WebhookEvent } from "@/lib/types";
import { clearAuth, getRefreshToken, persistAuth } from "@/lib/auth";

type BackendMerchant = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  city: string;
  contact_email: string;
};

type BackendDocument = {
  id: number;
  document_type: string;
  is_verified: boolean;
  is_uploaded: boolean;
};

type BackendWebhookSubscription = {
  id: number;
  is_active: boolean;
  created_at: string;
};

function mapMerchantStatus(status: string): Merchant["status"] {
  if (status === "ACTIVE") return "active";
  if (status === "SUSPENDED") return "failed";
  return "pending";
}

function mapKybStatus(status: string): Merchant["kybStatus"] {
  if (status === "ACTIVE") return "approved";
  if (status === "SUSPENDED") return "rejected";
  return "pending";
}

function mapMerchant(item: BackendMerchant): Merchant {
  return {
    id: String(item.id),
    name: item.name,
    status: mapMerchantStatus(item.status),
    kybStatus: mapKybStatus(item.status),
    createdAt: item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : "-",
    country: item.city ?? "-",
    email: item.contact_email ?? "-",
  };
}

function mapDocument(item: BackendDocument): KybDocument {
  return {
    id: String(item.id),
    name: item.document_type?.replaceAll("_", " ") ?? "Document",
    status: item.is_verified ? "verified" : item.is_uploaded ? "pending" : "rejected",
  };
}

export const api = {
  async login(email: string, password: string) {
    const res = await apiClient.post("/auth/login", { email, password });
    const payload = res.data?.data;
    persistAuth({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      operator: payload.operator,
    });
    return payload;
  },
  async logout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refreshToken });
    }
    clearAuth();
  },
  async getDashboardStats() {
    const [merchantsRes] = await Promise.all([apiClient.get("/merchants")]);
    const merchants = (merchantsRes.data?.data ?? []).map(mapMerchant) as Merchant[];

    const totalMerchants = merchants.length;
    const activeMerchants = merchants.filter((m) => m.status === "active").length;
    const pendingKyb = merchants.filter((m) => m.kybStatus === "pending").length;
    const failedKyb = merchants.filter((m) => m.kybStatus === "rejected").length;

    const stats: DashboardStats = {
      totalMerchants,
      activeMerchants,
      pendingKyb,
      failedKyb,
      webhookSuccess: webhookEvents.filter((w) => w.status === "success").length,
      webhookFailed: webhookEvents.filter((w) => w.status === "failed").length,
    };
    return stats;
  },
  async getActivities() {
    return activities;
  },
  async getMerchants() {
    const res = await apiClient.get("/merchants");
    return (res.data?.data ?? []).map(mapMerchant) as Merchant[];
  },
  async getMerchantById(id: string) {
    const res = await apiClient.get(`/merchants/${id}`);
    return mapMerchant(res.data?.data);
  },
  async getKybDocuments(merchantId: string) {
    const res = await apiClient.get(`/merchants/${merchantId}/documents`);
    return (res.data?.data ?? []).map(mapDocument) as KybDocument[];
  },
  async updateMerchantStatus(merchantId: string, newStatus: "ACTIVE" | "SUSPENDED", reason?: string) {
    const res = await apiClient.patch(`/merchants/${merchantId}/status`, { newStatus, reason });
    return mapMerchant(res.data?.data);
  },
  async getWebhookEvents() {
    try {
      const res = await apiClient.get("/webhooks");
      const subscriptions = (res.data?.data ?? []) as BackendWebhookSubscription[];
      if (subscriptions.length === 0) return webhookEvents;
      return subscriptions.map(
        (subscription): WebhookEvent => ({
          id: String(subscription.id),
          eventType: "merchant.status.changed",
          status: subscription.is_active ? "success" : "failed",
          retryCount: 0,
          timestamp: subscription.created_at ?? new Date().toISOString(),
        }),
      );
    } catch {
      return webhookEvents;
    }
  },
  async retryWebhookEvent() {
    return { success: true };
  },
  async getSecuritySessions() {
    return sessions;
  },
  async getFailedLogins() {
    return failedLogins;
  },
};
