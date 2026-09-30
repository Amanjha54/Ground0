// ====================================================================
// GROUND0: CORE SHARED DOMAIN TYPES
// ====================================================================

export type UserRole =
  | 'CITIZEN'
  | 'FIELD_WORKER'
  | 'CONTRACTOR'
  | 'INSPECTOR'
  | 'PROJECT_MANAGER'
  | 'ORGANIZATION_ADMIN'
  | 'AUDITOR'
  | 'SUPER_ADMIN';

export type ComplaintCategory =
  | 'POTHOLE'
  | 'GARBAGE'
  | 'DRAIN_BLOCKAGE'
  | 'WATER_LEAKAGE'
  | 'BROKEN_STREETLIGHT'
  | 'ROAD_DAMAGE'
  | 'ILLEGAL_DUMPING'
  | 'DAMAGED_PUBLIC_INFRASTRUCTURE'
  | 'ENVIRONMENTAL_ISSUE'
  | 'OTHER';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'TRIAGED'
  | 'LINKED_TO_MASTER'
  | 'WORK_ORDER_CREATED'
  | 'IN_PROGRESS'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED'
  | 'RESOLVED'
  | 'REOPENED'
  | 'REJECTED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkOrderStatus =
  | 'DRAFT'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'AWAITING_VERIFICATION'
  | 'UNDER_INSPECTION'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED';

export type EvidenceStage = 'BEFORE' | 'IN_PROGRESS' | 'AFTER' | 'INSPECTION';

export type VerificationPipelineStatus =
  | 'QUEUED'
  | 'PREPROCESSING'
  | 'INTEGRITY_CHECK'
  | 'LOCATION_CHECK'
  | 'SCENE_ANALYSIS'
  | 'CHANGE_ANALYSIS'
  | 'REQUIREMENT_ANALYSIS'
  | 'CAMERA_ANALYSIS'
  | 'RISK_ANALYSIS'
  | 'FINALIZING'
  | 'COMPLETED'
  | 'FAILED';

export type StepStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'WARNING' | 'FAILED' | 'SKIPPED';

export type HumanReviewDecision =
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_MORE_EVIDENCE'
  | 'SEND_PHYSICAL_INSPECTOR';

export type ProvenanceLabel = 'MEASURED' | 'REPORTED' | 'ESTIMATED';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  organization_id?: string;
  avatar_url?: string;
  reputation_score: number;
  is_verified: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo_url?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

export interface ComplaintMedia {
  id: string;
  complaint_id: string;
  storage_path: string;
  media_type: string;
  file_size_bytes: number;
  sha256_hash: string;
  exif_metadata?: Record<string, unknown>;
  is_primary: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  tracking_number: string;
  citizen_id?: string;
  organization_id?: string;
  master_issue_id?: string;
  category: ComplaintCategory;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  severity: SeverityLevel;
  status: ComplaintStatus;
  ai_predicted_category?: ComplaintCategory;
  ai_confidence?: number;
  ai_severity?: SeverityLevel;
  ai_notes?: string;
  duplicate_cluster_score?: number;
  weather_context?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  media?: ComplaintMedia[];
}

export interface MasterIssue {
  id: string;
  organization_id?: string;
  issue_code: string;
  category: ComplaintCategory;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  severity: SeverityLevel;
  total_reports: number;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
  complaints?: Complaint[];
}

export interface WorkOrderRequirement {
  id: string;
  work_order_id: string;
  title: string;
  description?: string;
  criterion_type: string;
  is_mandatory: boolean;
  ai_evaluation_prompt?: string;
  is_satisfied: boolean;
  created_at: string;
}

export interface WorkOrder {
  id: string;
  organization_id: string;
  master_issue_id?: string;
  site_id?: string;
  asset_id?: string;
  work_order_number: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: SeverityLevel;
  contractor_id?: string;
  assigned_worker_id?: string;
  inspector_id?: string;
  status: WorkOrderStatus;
  start_date?: string;
  deadline?: string;
  camera_verification_enabled: boolean;
  verification_policy?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  requirements?: WorkOrderRequirement[];
}

export interface CaptureSession {
  id: string;
  work_order_id: string;
  worker_id: string;
  stage: EvidenceStage;
  server_nonce: string;
  expected_latitude: number;
  expected_longitude: number;
  geofence_radius_meters: number;
  expires_at: string;
  is_valid: boolean;
  created_at: string;
}

export interface Evidence {
  id: string;
  capture_session_id?: string;
  work_order_id: string;
  worker_id: string;
  stage: EvidenceStage;
  original_storage_path: string;
  redacted_storage_path?: string;
  media_type: string;
  file_size_bytes: number;
  captured_latitude: number;
  captured_longitude: number;
  distance_delta_meters?: number;
  device_telemetry?: Record<string, unknown>;
  is_tampered: boolean;
  tamper_reason?: string;
  created_at: string;
  hashes?: {
    sha256_hash: string;
    phash: string;
  };
}

export interface VerificationStep {
  id: string;
  verification_run_id: string;
  step_name: string;
  step_order: number;
  status: StepStatus;
  score?: number;
  details?: Record<string, unknown>;
  execution_time_ms?: number;
}

export interface VerificationResult {
  id: string;
  verification_run_id: string;
  scene_match_percentage: number;
  physical_change_percentage: number;
  requirement_score: number;
  difference_mask_storage_path?: string;
  heatmap_storage_path?: string;
  side_by_side_artifact_path?: string;
  gemini_audit_report?: string;
}

export interface RiskFlag {
  id: string;
  verification_run_id: string;
  flag_code: string;
  severity: SeverityLevel;
  description: string;
  created_at: string;
}

export interface VerificationRun {
  id: string;
  work_order_id: string;
  before_evidence_id?: string;
  after_evidence_id?: string;
  status: VerificationPipelineStatus;
  current_stage: string;
  overall_confidence?: number;
  risk_score?: number;
  ai_recommendation: string;
  explanation_summary?: string;
  started_at: string;
  completed_at?: string;
  steps?: VerificationStep[];
  result?: VerificationResult;
  risk_flags?: RiskFlag[];
}

export interface HumanReview {
  id: string;
  verification_run_id: string;
  work_order_id: string;
  inspector_id: string;
  decision: HumanReviewDecision;
  review_notes: string;
  overridden_ai: boolean;
  created_at: string;
}

export interface Camera {
  id: string;
  organization_id: string;
  site_id?: string;
  name: string;
  stream_url_encrypted: string;
  webrtc_path: string;
  latitude: number;
  longitude: number;
  direction_heading_degrees?: number;
  is_online: boolean;
  last_heartbeat?: string;
  privacy_blur_enabled: boolean;
  created_at: string;
}

export interface EnvironmentalMetric {
  id: string;
  work_order_id: string;
  metric_type: string;
  metric_value: number;
  unit: string;
  provenance: ProvenanceLabel;
  calculation_basis?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  organization_id?: string;
  actor_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
