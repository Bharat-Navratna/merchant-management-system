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
  status: "active" | "pending" | "failed" | "suspended" | "restricted";
  kybStatus: "pending" | "under review" | "approved" | "rejected";
  createdAt: string;
  country: string;
  email: string;
  category?: string;
  updatedAt?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  riskScore?: number;
  kybVerifiedDocuments?: number;
  kybRequiredDocuments?: number;
  webhookEvents?: number;
  latestWebhookStatus?: "delivered" | "retrying" | "failed" | "pending";
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

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskSignal {
  id: string;
  merchant: string;
  level: RiskLevel;
  reason: string;
  score: number;
}

export interface RiskOverviewStats {
  highRiskMerchants: number;
  mediumRiskMerchants: number;
  lowRiskMerchants: number;
  averageRiskScore: number;
  watchlistMatches: number;
  rulesTriggered: number;
}

export interface RiskDistributionBucket {
  level: RiskLevel;
  label: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "flat";
  trendLabel: string;
}

export interface AiRiskSummary {
  summary: string;
  factors: string[];
  suggestedAction: string;
  confidence: number;
}

export interface TriggeredRiskRule {
  id: string;
  name: string;
  severity: RiskLevel;
  matches: number;
  lastTriggeredAt: string;
  description: string;
}

export interface WatchlistMerchant {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
  triggerReason: string;
  assignedReviewer: string;
  action: string;
}

export interface RiskTableMerchant {
  id: string;
  name: string;
  email: string;
  category: string;
  riskScore: number;
  riskLevel: RiskLevel;
  triggeredRules: string[];
  lastReviewedAt: string;
  reviewer: string;
  status: "open" | "under_review" | "watchlisted" | "cleared" | "escalated";
}

export interface RiskTimelineEvent {
  id: string;
  eventId: string;
  type: "rule_triggered" | "reviewer_assigned" | "score_changed" | "watchlist_added" | "manual_override";
  label: string;
  merchantName: string;
  timestamp: string;
  requestId: string;
  description: string;
}

export interface RiskNetworkInsight {
  activeSensors: number;
  threatLevel: "normal" | "elevated" | "critical";
  hotspots: Array<{
    id: string;
    label: string;
    level: RiskLevel;
    location: string;
  }>;
}

export interface RiskOverview {
  stable: number;
  medium: number;
  high: number;
  signals: RiskSignal[];
  stats: RiskOverviewStats;
  distribution: RiskDistributionBucket[];
  aiSummary: AiRiskSummary;
  triggeredRules: TriggeredRiskRule[];
  watchlist: WatchlistMerchant[];
  tableRows: RiskTableMerchant[];
  timeline: RiskTimelineEvent[];
  network: RiskNetworkInsight;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: string;
  entity: string;
  entityType?: "merchant" | "kyb" | "webhook" | "security" | "operator" | "system";
  entityId?: string;
  ipAddress: string;
  requestId: string;
  correlationId?: string;
  userAgent?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  severity: "low" | "medium" | "high";
}

export interface AuditSummaryStats {
  eventsToday: number;
  highSeverityEvents: number;
  failedLoginEvents: number;
  webhookReplayEvents: number;
  statusChanges: number;
  documentAccessEvents: number;
}

export interface AuditEventStreamItem {
  id: string;
  type: "login" | "status_change" | "document_verification" | "webhook_replay" | "role_change" | "failed_login";
  actor: string;
  label: string;
  timestamp: string;
  requestId: string;
  severity: AuditLog["severity"];
}

export interface AuditLogData {
  stats: AuditSummaryStats;
  events: AuditLog[];
  stream: AuditEventStreamItem[];
}

export interface ObservabilityMetric {
  id: string;
  label: string;
  value: string;
  status: "healthy" | "degraded" | "critical";
  detail: string;
}

export type ObservabilityStatus = "healthy" | "degraded" | "incident";

export interface ObservabilitySummaryStats {
  apiP95Latency: string;
  errorRate: string;
  requestVolume: string;
  databaseHealth: string;
  workerLag: string;
  webhookQueueDepth: string;
  failedJobs: string;
  uptime: string;
}

export interface HealthCheck {
  id: string;
  component: "API" | "Database" | "Webhook Worker" | "Object Storage" | "Auth Service" | "Queue Processor";
  status: ObservabilityStatus;
  latency: string;
  lastCheckedAt: string;
  detail: string;
}

export interface MetricPanelData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  status: ObservabilityStatus;
  trendLabel: string;
  points: number[];
}

export interface IncidentAlert {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedComponent: string;
  startedAt: string;
  status: "investigating" | "monitoring" | "resolved";
  action: string;
}

export interface TraceExample {
  id: string;
  requestId: string;
  traceId: string;
  service: string;
  route: string;
  latency: string;
  status: ObservabilityStatus;
}

export interface SystemHealthTimelineEvent {
  id: string;
  type: "deployment" | "latency_spike" | "worker_delay" | "retry_storm" | "recovery";
  title: string;
  description: string;
  timestamp: string;
  requestId?: string;
}

export interface ObservabilityData {
  stats: ObservabilitySummaryStats;
  healthChecks: HealthCheck[];
  metrics: MetricPanelData[];
  incidents: IncidentAlert[];
  traces: TraceExample[];
  timeline: SystemHealthTimelineEvent[];
}

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

// ─── Merchant Detail ─────────────────────────────────────────────────────────

export interface MerchantDetail extends Merchant {
  legalName: string;
  registrationNumber: string;
  taxId?: string;
  phone?: string;
  website?: string;
  address?: string;
  city: string;
  assignedReviewer?: string;
}

export interface KybDocumentDetail {
  id: string;
  name: string;
  docType: "business_registration" | "owner_identity" | "bank_account_proof";
  status: "verified" | "pending" | "rejected" | "not_uploaded";
  uploadedAt?: string;
  fileSize?: string;
  fileType?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  decisionReason?: string;
}

export interface RiskRule {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface MerchantRiskDetail {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  triggeredRules: RiskRule[];
  reasons: string[];
  suggestedAction: string;
  aiSummary: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  description: string;
  actor?: string;
  fromStatus?: string;
  toStatus?: string;
  reason?: string;
  requestId?: string;
  type: "status_change" | "document" | "risk" | "system" | "note";
}

export interface MerchantWebhookEntry {
  id: string;
  eventType: string;
  deliveryStatus: "delivered" | "failed" | "retrying" | "pending";
  endpoint: string;
  attempts: number;
  lastAttemptedAt: string;
  requestId: string;
  httpStatus?: number;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface MerchantAuditEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  requestId: string;
  ipAddress?: string;
}

// ─── KYB Review Queue ─────────────────────────────────────────────────────────

export type KybSlaUrgency = "normal" | "warning" | "critical" | "breached";

export interface KybQueueEntry {
  id: string;
  /** Links to an existing mock Merchant if available */
  merchantId?: string;
  merchantName: string;
  category: string;
  country: string;
  submittedDocCount: number;
  totalDocCount: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  /** ISO timestamp when the SLA expires */
  slaDeadlineIso: string;
  assignedReviewer: string;
  priority: "urgent" | "high" | "normal" | "low";
  status: "pending" | "under_review" | "escalated";
  submittedAt: string;
  requestId: string;
  tags: string[];
}

export interface KybQueueStats {
  awaitingReview: number;
  slaBreachingSoon: number;
  approvedToday: number;
  rejectedToday: number;
  resubmissionRequired: number;
}

export interface KybChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  required: boolean;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "primary" | "secondary" | "tertiary" | "success" | "warning" | "danger";
}

export interface DashboardPipelineStage {
  id: string;
  label: string;
  count: string;
  status: "healthy" | "watch" | "risk" | "neutral";
  detail: string;
}

export interface DashboardKybQueueItem {
  id: string;
  merchantName: string;
  submittedDocuments: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  slaTimer: string;
  reviewer: string;
  action: string;
}

export interface DashboardRiskMerchant {
  id: string;
  merchantName: string;
  score: number;
  reason: string;
  action: string;
}

export interface DashboardWebhookHealth {
  deliverySuccessRate: string;
  pendingRetries: number;
  failedDeliveries: number;
  deadLetterEvents: number;
  endpointHealth: Array<{
    id: string;
    endpoint: string;
    status: "healthy" | "degraded" | "down";
    latency: string;
  }>;
}

export interface DashboardAuditActivity {
  id: string;
  operator: string;
  action: string;
  entity: string;
  timestamp: string;
  requestId: string;
}

export interface DashboardSystemHealthItem {
  id: string;
  label: string;
  value: string;
  status: "healthy" | "degraded" | "critical";
}

export interface CommandCenterDashboard {
  metrics: DashboardMetric[];
  pipeline: DashboardPipelineStage[];
  kybQueue: DashboardKybQueueItem[];
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  highRiskMerchants: DashboardRiskMerchant[];
  webhookHealth: DashboardWebhookHealth;
  auditActivity: DashboardAuditActivity[];
  systemHealth: DashboardSystemHealthItem[];
}

// ─── Webhook Ops ────────────────────────────────────────────────────────────

export type WebhookDeliveryStatus = 
  | "delivered" 
  | "pending" 
  | "retrying" 
  | "failed" 
  | "dead_lettered"
  | "in_progress";

export type WebhookSubscriptionStatus = "active" | "paused" | "inactive" | "unhealthy";

export type WebhookPayload = Record<string, unknown>;

export interface WebhookAttempt {
  id: string;
  attemptNumber: number;
  timestamp: string;
  status: "success" | "failed" | "retrying";
  httpStatus?: number;
  responseTime?: number;
  errorMessage?: string;
  nextRetryTime?: string;
}

export interface WebhookDelivery {
  id: string;
  eventId: string;
  eventType: string;
  merchantId: string;
  merchantName: string;
  subscriptionId: string;
  endpoint: string;
  status: WebhookDeliveryStatus;
  httpStatus?: number;
  attempts: WebhookAttempt[];
  latency?: number;
  requestId: string;
  payload?: WebhookPayload;
  signature?: string;
  lastAttemptedAt?: string;
  nextRetryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookSubscription {
  id: string;
  endpoint: string;
  eventTypes: string[];
  status: WebhookSubscriptionStatus;
  signingSecretStatus: "active" | "expired" | "compromised";
  health: "healthy" | "degraded" | "unhealthy";
  lastDeliveryAt?: string;
  lastDeliveryStatus?: WebhookDeliveryStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  merchantCount?: number;
  successRate?: number;
  averageLatency?: number;
}

export interface WebhookOpsStats {
  deliverySuccessRate: number;
  pendingDeliveries: number;
  failedDeliveries: number;
  deadLetterQueue: number;
  averageLatency: number;
  activeSubscriptions: number;
  systemHealthy: boolean;
  lastEventProcessed?: string;
}

export interface WebhookOpsData {
  stats: WebhookOpsStats;
  subscriptions: WebhookSubscription[];
  deliveries: WebhookDelivery[];
  retryQueueBreakdown: {
    pending: number;
    in_progress: number;
    retrying: number;
    failed: number;
    dead_lettered: number;
  };
}

// ─── Security ────────────────────────────────────────────────────────────────

export interface SecuritySummaryStats {
  activeSessions: number;
  failedLogins: number;
  lockedAccounts: number;
  mfaCoverage: string;
  adminUsers: number;
  rateLimitEvents: number;
}

export interface OperatorSession {
  id: string;
  operator: string;
  email: string;
  role: string;
  device: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  status: "active" | "idle" | "suspicious";
}

export type SuspiciousActivitySeverity = "critical" | "high" | "medium" | "low";

export interface SuspiciousActivity {
  id: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
  reason: string;
  attempts: number;
  severity: SuspiciousActivitySeverity;
  status: "open" | "investigating" | "resolved";
}

export interface RoleDistributionItem {
  role: string;
  count: number;
  percentage: number;
  color: "primary" | "secondary" | "tertiary" | "success" | "warning" | "destructive";
}

export type SecurityPostureStatus = "enabled" | "partial" | "planned" | "action_required";

export interface SecurityPostureItem {
  id: string;
  label: string;
  description: string;
  status: SecurityPostureStatus;
  color: "primary" | "secondary" | "tertiary" | "success" | "warning" | "destructive";
}

export type SecurityEventType =
  | "login_success"
  | "failed_login"
  | "token_refresh"
  | "account_locked"
  | "role_changed"
  | "webhook_secret_rotated"
  | "session_revoked";

export interface SecurityStreamEvent {
  id: string;
  type: SecurityEventType;
  actor: string;
  label: string;
  timestamp: string;
  ipAddress?: string;
  requestId: string;
  severity: "low" | "medium" | "high";
}

export interface SecurityData {
  stats: SecuritySummaryStats;
  sessions: OperatorSession[];
  suspiciousActivity: SuspiciousActivity[];
  roleDistribution: RoleDistributionItem[];
  postureChecklist: SecurityPostureItem[];
  eventStream: SecurityStreamEvent[];
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface OrgSettings {
  name: string;
  slug: string;
  region: string;
  timezone: string;
  supportEmail: string;
}

export interface EnvironmentSettings {
  environment: "sandbox" | "production";
  apiBaseUrl: string;
  frontendUrl: string;
  webhookWorkerStatus: "healthy" | "degraded" | "offline";
  deploymentRegion: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  permissions: string[];
}

export interface RoleEntry {
  id: string;
  name: string;
  userCount: number;
  description: string;
  permissionGroups: string[];
}

export interface RolesPermissionsSettings {
  roles: RoleEntry[];
  permissionGroups: PermissionGroup[];
}

export interface WebhookSigningSettings {
  algorithm: string;
  secretStatus: "active" | "rotation_pending" | "expired";
  replayProtectionWindow: string;
  timestampTolerance: string;
  signatureHeader: string;
}

export interface RiskRuleSetting {
  id: string;
  name: string;
  enabled: boolean;
  severity: "high" | "medium" | "low";
  threshold: string;
  lastUpdated: string;
}

export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  scopes: string[];
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
  environment: "production" | "sandbox";
}

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SettingsData {
  organization: OrgSettings;
  environment: EnvironmentSettings;
  rolesPermissions: RolesPermissionsSettings;
  webhookSigning: WebhookSigningSettings;
  riskRules: RiskRuleSetting[];
  apiKeys: ApiKey[];
  notifications: NotificationPreference[];
}
