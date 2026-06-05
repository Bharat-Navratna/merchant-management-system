import {
  mockActivities,
  mockAuditLogData,
  mockAuditLogs,
  mockCommandCenterDashboard,
  mockDashboardStats,
  mockFailedLogins,
  mockInternalNotes,
  mockKybChecklist,
  mockKybDocumentsByMerchant,
  mockKybDocumentDetails,
  mockKybQueueEntries,
  mockKybQueueStats,
  mockMerchantAuditTrail,
  mockMerchantDetails,
  mockMerchantRisk,
  mockMerchants,
  mockMerchantTimeline,
  mockMerchantWebhooks,
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
import { clearAuth, persistAuth } from "@/lib/auth";
import { Merchant } from "@/lib/types";

const MOCK_EMAIL = "admin@yqnpay.com";
const MOCK_PASSWORD = "Admin123!";

let previewMerchants = [...mockMerchants];

const wait = () => new Promise((resolve) => setTimeout(resolve, 120));

function getDocumentsForMerchant(merchantId: string) {
  return mockKybDocumentsByMerchant[merchantId] ?? mockKybDocumentsByMerchant.m1;
}

function toUpdatedMerchant(
  merchant: Merchant,
  newStatus: "ACTIVE" | "SUSPENDED",
): Merchant {
  if (newStatus === "ACTIVE") {
    return { ...merchant, status: "active", kybStatus: "approved" };
  }

  return { ...merchant, status: "failed", kybStatus: "rejected" };
}

export const mockApi = {
  async login(email: string, password: string) {
    await wait();

    if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
      throw new Error("Invalid mock credentials");
    }

    const payload = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      operator: {
        id: 1,
        email: MOCK_EMAIL,
        role: "ADMIN",
      },
    };

    persistAuth(payload);
    return payload;
  },
  async logout() {
    await wait();
    clearAuth();
  },
  async getDashboardStats() {
    await wait();
    return mockDashboardStats;
  },
  async getCommandCenterDashboard() {
    await wait();
    return mockCommandCenterDashboard;
  },
  async getActivities() {
    await wait();
    return mockActivities;
  },
  async getMerchants() {
    await wait();
    return previewMerchants;
  },
  async getMerchantById(id: string) {
    await wait();
    return previewMerchants.find((merchant) => merchant.id === id) ?? previewMerchants[0];
  },
  async getKybDocuments(merchantId: string) {
    await wait();
    return getDocumentsForMerchant(merchantId);
  },
  async updateMerchantStatus(
    merchantId: string,
    newStatus: "ACTIVE" | "SUSPENDED",
    reason?: string,
  ) {
    await wait();
    void reason;
    const existing = previewMerchants.find((merchant) => merchant.id === merchantId);
    const updated = toUpdatedMerchant(existing ?? previewMerchants[0], newStatus);
    previewMerchants = previewMerchants.map((merchant) =>
      merchant.id === updated.id ? updated : merchant,
    );
    return updated;
  },
  async getWebhookEvents() {
    await wait();
    return mockWebhookEvents;
  },
  async retryWebhookEvent() {
    await wait();
    return { success: true };
  },
  async getRiskOverview() {
    await wait();
    return mockRiskOverview;
  },
  async getAuditLogs() {
    await wait();
    return mockAuditLogs;
  },
  async getAuditLogData() {
    await wait();
    return mockAuditLogData;
  },
  async getObservabilityMetrics() {
    await wait();
    return mockObservabilityMetrics;
  },
  async getObservabilityData() {
    await wait();
    return mockObservabilityData;
  },
  async getSecuritySessions() {
    await wait();
    return mockSessions;
  },
  async getFailedLogins() {
    await wait();
    return mockFailedLogins;
  },
  async getSettings() {
    await wait();
    return mockSettings;
  },

  async getMerchantDetail(id: string) {
    await wait();
    return mockMerchantDetails[id] ?? mockMerchantDetails.m1;
  },
  async getKybDocumentDetails(merchantId: string) {
    await wait();
    return mockKybDocumentDetails[merchantId] ?? mockKybDocumentDetails.m1;
  },
  async getMerchantRisk(merchantId: string) {
    await wait();
    return mockMerchantRisk[merchantId] ?? mockMerchantRisk.m1;
  },
  async getMerchantTimeline(merchantId: string) {
    await wait();
    return mockMerchantTimeline[merchantId] ?? [];
  },
  async getMerchantWebhookEntries(merchantId: string) {
    await wait();
    return mockMerchantWebhooks[merchantId] ?? [];
  },
  async getInternalNotes(merchantId: string) {
    await wait();
    return mockInternalNotes[merchantId] ?? [];
  },
  async getMerchantAuditTrail(merchantId: string) {
    await wait();
    return mockMerchantAuditTrail[merchantId] ?? [];
  },

  async getKybQueueStats() {
    await wait();
    return mockKybQueueStats;
  },
  async getKybQueue() {
    await wait();
    return mockKybQueueEntries;
  },
  async getKybChecklist(entryId: string) {
    await wait();
    return mockKybChecklist[entryId] ?? [];
  },

  async getWebhookOpsData() {
    await wait();
    return mockWebhookOpsData;
  },
  async replayWebhookDelivery(deliveryId: string) {
    void deliveryId;
    await wait();
    return { success: true };
  },

  async getSecurityData() {
    await wait();
    return mockSecurityData;
  },

  async getSettingsData() {
    await wait();
    return mockSettingsData;
  },
};
