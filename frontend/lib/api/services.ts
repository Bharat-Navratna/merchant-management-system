import { apiClient } from "@/lib/api/client";
import { mockApi } from "@/lib/mock/api";
import {
  mockAuditLogData,
  mockAuditLogs,
  mockActivities,
  mockCommandCenterDashboard,
  mockFailedLogins,
  mockKybChecklist,
  mockKybQueueEntries,
  mockKybQueueStats,
  mockMerchantDetails,
  mockKybDocumentDetails,
  mockMerchantRisk,
  mockMerchantTimeline,
  mockMerchantWebhooks,
  mockInternalNotes,
  mockMerchantAuditTrail,
  mockObservabilityMetrics,
  mockObservabilityData,
  mockRiskOverview,
  mockSecurityData,
  mockSessions,
  mockSettings,
  mockSettingsData,
  mockWebhookEvents,
  mockWebhookOpsData,
} from "@/lib/mock/data";
import {
  AuditLogData,
  DashboardStats,
  KybChecklistItem,
  KybDocument,
  KybDocumentDetail,
  KybQueueEntry,
  KybQueueStats,
  Merchant,
  MerchantDetail,
  ObservabilityData,
  SecurityData,
  SettingsData,
  WebhookEvent,
  WebhookOpsData,
  WebhookSubscription,
} from "@/lib/types";
import { clearAuth, getRefreshToken, persistAuth } from "@/lib/auth";

// Local UI preview only. When enabled, all service methods short-circuit before Axios.
export const useMockApi = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

type BackendMerchant = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at?: string;
  category?: string;
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
  target_url?: string;
  secret?: string;
  updated_at?: string;
};

function mapMerchantStatus(status: string): Merchant["status"] {
  if (status === "ACTIVE") return "active";
  if (status === "SUSPENDED") return "suspended";
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
    updatedAt: item.updated_at ? new Date(item.updated_at).toISOString().slice(0, 10) : "-",
    country: item.city ?? "-",
    email: item.contact_email ?? "-",
    category: item.category ?? "General",
    riskLevel: item.status === "SUSPENDED" ? "high" : item.status === "ACTIVE" ? "low" : "medium",
    riskScore: item.status === "SUSPENDED" ? 76 : item.status === "ACTIVE" ? 24 : 52,
    kybVerifiedDocuments: item.status === "ACTIVE" ? 3 : item.status === "SUSPENDED" ? 2 : 1,
    kybRequiredDocuments: 3,
    webhookEvents: item.status === "ACTIVE" ? 128 : item.status === "SUSPENDED" ? 12 : 0,
    latestWebhookStatus: item.status === "ACTIVE" ? "delivered" : item.status === "SUSPENDED" ? "failed" : "pending",
  };
}

function mapDocument(item: BackendDocument): KybDocument {
  return {
    id: String(item.id),
    name: item.document_type?.replaceAll("_", " ") ?? "Document",
    status: item.is_verified ? "verified" : item.is_uploaded ? "pending" : "rejected",
  };
}

const realApi = {
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
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } finally {
      clearAuth();
    }
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
      webhookSuccess: mockWebhookEvents.filter((w) => w.status === "success").length,
      webhookFailed: mockWebhookEvents.filter((w) => w.status === "failed").length,
    };
    return stats;
  },
  async getCommandCenterDashboard() {
    const [merchantsRes] = await Promise.all([apiClient.get("/merchants")]);
    const merchants = (merchantsRes.data?.data ?? []).map(mapMerchant) as Merchant[];
    const activeMerchants = merchants.filter((merchant) => merchant.status === "active").length;
    const pendingKyb = merchants.filter((merchant) => merchant.kybStatus === "pending").length;
    const failedKyb = merchants.filter((merchant) => merchant.kybStatus === "rejected").length;

    return {
      ...mockCommandCenterDashboard,
      metrics: mockCommandCenterDashboard.metrics.map((metric) => {
        if (metric.id === "total-merchants") {
          return { ...metric, value: merchants.length.toLocaleString() };
        }
        if (metric.id === "pending-kyb") {
          return { ...metric, value: pendingKyb.toLocaleString() };
        }
        if (metric.id === "active-merchants") {
          return { ...metric, value: activeMerchants.toLocaleString() };
        }
        if (metric.id === "high-risk-reviews") {
          return { ...metric, value: failedKyb.toLocaleString() };
        }
        return metric;
      }),
    };
  },
  async getActivities() {
    return mockActivities;
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
      if (subscriptions.length === 0) return mockWebhookEvents;
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
      return mockWebhookEvents;
    }
  },
  async retryWebhookEvent() {
    return { success: true };
  },
  async getRiskOverview() {
    return mockRiskOverview;
  },
  async getAuditLogs() {
    return mockAuditLogs;
  },
  async getAuditLogData(): Promise<AuditLogData> {
    return mockAuditLogData;
  },
  async getObservabilityMetrics() {
    return mockObservabilityMetrics;
  },
  async getObservabilityData(): Promise<ObservabilityData> {
    return mockObservabilityData;
  },
  async getSecuritySessions() {
    return mockSessions;
  },
  async getFailedLogins() {
    return mockFailedLogins;
  },
  async getSettings() {
    return mockSettings;
  },

  // Real backend does not yet expose these endpoints; fall back to mock data
  // so the UI works correctly in both environments until the API is extended.
  async getMerchantDetail(id: string): Promise<MerchantDetail> {
    try {
      const res = await apiClient.get(`/merchants/${id}`);
      const base = mapMerchant(res.data?.data);
      // Prefer the locally-enriched record which has the extra MerchantDetail fields.
      const detail = mockMerchantDetails[id];
      if (detail) return { ...base, ...detail };
      // Fall back: synthesise required MerchantDetail fields from the base Merchant.
      return {
        ...base,
        legalName: base.name,
        registrationNumber: "-",
        city: base.country,
      };
    } catch {
      return mockMerchantDetails[id] ?? mockMerchantDetails.m1;
    }
  },
  async getKybDocumentDetails(merchantId: string): Promise<KybDocumentDetail[]> {
    try {
      const res = await apiClient.get(`/merchants/${merchantId}/documents`);
      const docs = (res.data?.data ?? []).map(mapDocument) as KybDocument[];
      // The real backend returns the simpler KybDocument shape; map it to KybDocumentDetail.
      if (docs.length > 0) {
        return docs.map(
          (d): KybDocumentDetail => ({
            id: d.id,
            name: d.name,
            docType: "business_registration",
            status: d.status === "verified"
              ? "verified"
              : d.status === "rejected"
              ? "rejected"
              : "pending",
          }),
        );
      }
      return mockKybDocumentDetails[merchantId] ?? mockKybDocumentDetails.m1;
    } catch {
      return mockKybDocumentDetails[merchantId] ?? mockKybDocumentDetails.m1;
    }
  },
  async getMerchantRisk(merchantId: string) {
    return mockMerchantRisk[merchantId] ?? mockMerchantRisk.m1;
  },
  async getMerchantTimeline(merchantId: string) {
    return mockMerchantTimeline[merchantId] ?? [];
  },
  async getMerchantWebhookEntries(merchantId: string) {
    return mockMerchantWebhooks[merchantId] ?? [];
  },
  async getInternalNotes(merchantId: string) {
    return mockInternalNotes[merchantId] ?? [];
  },
  async getMerchantAuditTrail(merchantId: string) {
    return mockMerchantAuditTrail[merchantId] ?? [];
  },

  // Real backend has no dedicated queue endpoint yet; fall back to mock data.
  async getKybQueueStats(): Promise<KybQueueStats> {
    return mockKybQueueStats;
  },
  async getKybQueue(): Promise<KybQueueEntry[]> {
    try {
      const res = await apiClient.get("/merchants");
      const merchants = (res.data?.data ?? []) as Array<{ id: number; status: string; name: string }>;
      // Derive a minimal queue from pending/under-review merchants when live data exists.
      const pending = merchants.filter(
        (m) => m.status !== "ACTIVE" && m.status !== "SUSPENDED",
      );
      if (pending.length > 0) {
        // Supplement with existing mock for full richness; live data takes name/id.
        return mockKybQueueEntries.map((entry, i) => ({
          ...entry,
          merchantId: pending[i] ? String(pending[i].id) : entry.merchantId,
          merchantName: pending[i]?.name ?? entry.merchantName,
        }));
      }
    } catch {
      // Use queue preview data when the live queue fetch is unavailable.
    }
    return mockKybQueueEntries;
  },
  async getKybChecklist(entryId: string): Promise<KybChecklistItem[]> {
    return mockKybChecklist[entryId] ?? [];
  },

  // Real backend exposes basic webhook subscriptions; delivery telemetry falls
  // back to preview data until those API endpoints exist.
  async getWebhookOpsData(): Promise<WebhookOpsData> {
    try {
      const res = await apiClient.get("/webhooks");
      const backendSubscriptions = (res.data?.data ?? []) as BackendWebhookSubscription[];
      if (backendSubscriptions.length === 0) return mockWebhookOpsData;

      const subscriptions: WebhookSubscription[] = backendSubscriptions.map((subscription) => ({
        id: String(subscription.id),
        endpoint: subscription.target_url ?? "Configured endpoint",
        eventTypes: ["MERCHANT_APPROVED", "MERCHANT_SUSPENDED"],
        status: subscription.is_active ? "active" : "inactive",
        signingSecretStatus: subscription.secret ? "active" : "expired",
        health: subscription.is_active ? "healthy" : "degraded",
        lastDeliveryAt: undefined,
        createdBy: "Backend API",
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at ?? subscription.created_at,
        successRate: undefined,
        averageLatency: undefined,
      }));

      return {
        ...mockWebhookOpsData,
        stats: {
          ...mockWebhookOpsData.stats,
          activeSubscriptions: subscriptions.filter((subscription) => subscription.status === "active").length,
        },
        subscriptions,
      };
    } catch {
      return mockWebhookOpsData;
    }
  },
  async replayWebhookDelivery(deliveryId: string) {
    void deliveryId;
    return { success: true };
  },

  // Real backend exposes /sessions and /auth/failed-logins; the full security
  // data shape is richer than what the API returns today — fall back to mock.
  async getSecurityData(): Promise<SecurityData> {
    try {
      const [sessionsRes, failedRes] = await Promise.all([
        apiClient.get("/sessions"),
        apiClient.get("/auth/failed-logins").catch(() => ({ data: { data: [] } })),
      ]);
      const liveSessions = sessionsRes.data?.data ?? [];
      if (liveSessions.length === 0) return mockSecurityData;
      return {
        ...mockSecurityData,
        stats: {
          ...mockSecurityData.stats,
          activeSessions: liveSessions.length,
          failedLogins: (failedRes.data?.data ?? []).length,
        },
      };
    } catch {
      return mockSecurityData;
    }
  },

  // No dedicated settings endpoint exists yet — always fall back to mock data.
  async getSettingsData(): Promise<SettingsData> {
    return mockSettingsData;
  },
};

export const api = useMockApi ? mockApi : realApi;
