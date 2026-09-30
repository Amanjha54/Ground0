-- ====================================================================
-- GROUND0: PRODUCTION DATABASE MIGRATION
-- AI-Powered Proof of Physical Work & Municipal Trust Infrastructure
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'CITIZEN',
        'FIELD_WORKER',
        'CONTRACTOR',
        'INSPECTOR',
        'PROJECT_MANAGER',
        'ORGANIZATION_ADMIN',
        'AUDITOR',
        'SUPER_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_category AS ENUM (
        'POTHOLE',
        'GARBAGE',
        'DRAIN_BLOCKAGE',
        'WATER_LEAKAGE',
        'BROKEN_STREETLIGHT',
        'ROAD_DAMAGE',
        'ILLEGAL_DUMPING',
        'DAMAGED_PUBLIC_INFRASTRUCTURE',
        'ENVIRONMENTAL_ISSUE',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status AS ENUM (
        'SUBMITTED',
        'TRIAGED',
        'LINKED_TO_MASTER',
        'WORK_ORDER_CREATED',
        'IN_PROGRESS',
        'AWAITING_VERIFICATION',
        'VERIFIED',
        'RESOLVED',
        'REOPENED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_status AS ENUM (
        'DRAFT',
        'ASSIGNED',
        'IN_PROGRESS',
        'AWAITING_VERIFICATION',
        'UNDER_INSPECTION',
        'APPROVED',
        'REJECTED',
        'CLOSED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_stage AS ENUM (
        'BEFORE',
        'IN_PROGRESS',
        'AFTER',
        'INSPECTION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_pipeline_status AS ENUM (
        'QUEUED',
        'PREPROCESSING',
        'INTEGRITY_CHECK',
        'LOCATION_CHECK',
        'SCENE_ANALYSIS',
        'CHANGE_ANALYSIS',
        'REQUIREMENT_ANALYSIS',
        'CAMERA_ANALYSIS',
        'RISK_ANALYSIS',
        'FINALIZING',
        'COMPLETED',
        'FAILED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE step_status AS ENUM (
        'PENDING',
        'RUNNING',
        'PASSED',
        'WARNING',
        'FAILED',
        'SKIPPED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_type AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE human_review_decision AS ENUM (
        'APPROVE',
        'REJECT',
        'REQUEST_MORE_EVIDENCE',
        'SEND_PHYSICAL_INSPECTOR'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE provenance_label AS ENUM (
        'MEASURED',
        'REPORTED',
        'ESTIMATED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE IDENTITY & ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'MUNICIPALITY', -- MUNICIPALITY, CONTRACTOR, AUDIT_FIRM
    jurisdiction_bounds JSONB, -- GeoJSON boundary
    logo_url TEXT,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'CITIZEN',
    phone_number VARCHAR(50),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    avatar_url TEXT,
    reputation_score INT DEFAULT 100,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 4. GEOGRAPHIC SITES & ASSETS
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_meters DOUBLE PRECISION DEFAULT 100.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL, -- ROAD_SEGMENT, DRAINAGE_CULVERT, WASTE_ZONE, STREETLIGHT_POLE
    metadata JSONB DEFAULT '{}'::jsonb,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget NUMERIC(15,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMPLAINTS & MASTER ISSUES
CREATE TABLE IF NOT EXISTS master_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    issue_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. GR0-420
    category complaint_category NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    severity severity_level DEFAULT 'MEDIUM',
    total_reports INT DEFAULT 1,
    status complaint_status DEFAULT 'TRIAGED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. GR0-2941
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    master_issue_id UUID REFERENCES master_issues(id) ON DELETE SET NULL,
    category complaint_category NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    severity severity_level DEFAULT 'MEDIUM',
    status complaint_status DEFAULT 'SUBMITTED',
    ai_predicted_category complaint_category,
    ai_confidence DOUBLE PRECISION,
    ai_severity severity_level,
    ai_notes TEXT,
    duplicate_cluster_score DOUBLE PRECISION,
    weather_context JSONB DEFAULT '{}'::jsonb, -- Open-Meteo context at capture time
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- image/jpeg, video/mp4, audio/webm
    file_size_bytes BIGINT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    exif_metadata JSONB DEFAULT '{}'::jsonb,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_issue_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    master_issue_id UUID NOT NULL REFERENCES master_issues(id) ON DELETE CASCADE,
    similarity_score DOUBLE PRECISION,
    linked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(complaint_id, master_issue_id)
);

CREATE TABLE IF NOT EXISTS citizen_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_solved BOOLEAN NOT NULL,
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
    feedback_notes TEXT,
    reopen_evidence_path TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WORK ORDERS & ASSIGNMENTS
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    master_issue_id UUID REFERENCES master_issues(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    work_order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. WO-2091
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category complaint_category NOT NULL,
    priority severity_level DEFAULT 'HIGH',
    contractor_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    assigned_worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    inspector_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status work_order_status DEFAULT 'DRAFT',
    start_date TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    camera_verification_enabled BOOLEAN DEFAULT FALSE,
    verification_policy JSONB DEFAULT '{"min_scene_match": 0.80, "min_change_score": 0.75}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_order_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    criterion_type VARCHAR(100) NOT NULL, -- VISUAL_CLEARANCE, SURFACE_REPAIR, SEALING, REPLACEMENT
    is_mandatory BOOLEAN DEFAULT TRUE,
    ai_evaluation_prompt TEXT,
    is_satisfied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'ASSIGNED'
);

-- 7. CAPTURE SESSIONS & EVIDENCE INTEGRITY
CREATE TABLE IF NOT EXISTS capture_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stage evidence_stage NOT NULL,
    server_nonce VARCHAR(64) NOT NULL, -- Nonce to prevent replay attacks
    expected_latitude DOUBLE PRECISION NOT NULL,
    expected_longitude DOUBLE PRECISION NOT NULL,
    geofence_radius_meters DOUBLE PRECISION DEFAULT 50.0,
    expires_at TIMESTAMPTZ NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capture_session_id UUID REFERENCES capture_sessions(id) ON DELETE SET NULL,
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stage evidence_stage NOT NULL,
    original_storage_path TEXT NOT NULL,
    redacted_storage_path TEXT,
    media_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    captured_latitude DOUBLE PRECISION NOT NULL,
    captured_longitude DOUBLE PRECISION NOT NULL,
    distance_delta_meters DOUBLE PRECISION,
    device_telemetry JSONB DEFAULT '{}'::jsonb,
    is_tampered BOOLEAN DEFAULT FALSE,
    tamper_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_hashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    sha256_hash VARCHAR(64) NOT NULL UNIQUE,
    phash VARCHAR(64) NOT NULL, -- Perceptual hash for visual duplicate spotting
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    model_name VARCHAR(100) DEFAULT 'dinov2_base',
    embedding_dim INT DEFAULT 768,
    embedding_vector JSONB NOT NULL, -- Vector JSON array
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI VERIFICATION PIPELINE RUNS
CREATE TABLE IF NOT EXISTS verification_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    before_evidence_id UUID REFERENCES evidence(id) ON DELETE SET NULL,
    after_evidence_id UUID REFERENCES evidence(id) ON DELETE SET NULL,
    status verification_pipeline_status DEFAULT 'QUEUED',
    current_stage VARCHAR(100) DEFAULT 'INTEGRITY_CHECK',
    overall_confidence DOUBLE PRECISION,
    risk_score DOUBLE PRECISION,
    ai_recommendation VARCHAR(100) DEFAULT 'PENDING_EVALUATION', -- READY_FOR_APPROVAL, ESCALATE_HUMAN_INSPECTION, REJECT
    explanation_summary TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_run_id UUID NOT NULL REFERENCES verification_runs(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL, -- INTEGRITY, LOCATION, SCENE_MATCH, CHANGE_DETECTION, REQUIREMENT, CCTV, RISK
    step_order INT NOT NULL,
    status step_status DEFAULT 'PENDING',
    score DOUBLE PRECISION,
    details JSONB DEFAULT '{}'::jsonb,
    execution_time_ms INT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_run_id UUID NOT NULL REFERENCES verification_runs(id) ON DELETE CASCADE UNIQUE,
    scene_match_percentage DOUBLE PRECISION NOT NULL,
    physical_change_percentage DOUBLE PRECISION NOT NULL,
    requirement_score DOUBLE PRECISION NOT NULL,
    difference_mask_storage_path TEXT,
    heatmap_storage_path TEXT,
    side_by_side_artifact_path TEXT,
    gemini_audit_report TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_run_id UUID NOT NULL REFERENCES verification_runs(id) ON DELETE CASCADE,
    flag_code VARCHAR(100) NOT NULL, -- REPLAY_DETECTED, SCENE_MISMATCH, GEOFENCE_DRIFT, CRITERIA_UNMET, METADATA_STRIPPED
    severity risk_level_type NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS human_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_run_id UUID NOT NULL REFERENCES verification_runs(id) ON DELETE CASCADE,
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    decision human_review_decision NOT NULL,
    review_notes TEXT NOT NULL,
    overridden_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CCTV CAMERAS & VIDEO PIPELINE
CREATE TABLE IF NOT EXISTS cameras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    stream_url_encrypted TEXT NOT NULL, -- Encrypted RTSP/HLS stream endpoint
    webrtc_path VARCHAR(255) NOT NULL, -- Relative path in MediaMTX
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    direction_heading_degrees DOUBLE PRECISION,
    is_online BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMPTZ,
    privacy_blur_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS camera_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id UUID NOT NULL REFERENCES cameras(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- WORK_ACTIVITY_DETECTED, TRUCK_ARRIVED, SITE_CLEARED
    confidence DOUBLE PRECISION,
    snapshot_storage_path TEXT,
    event_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUSTAINABILITY, NOTIFICATIONS & AUDITING
CREATE TABLE IF NOT EXISTS environmental_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- WASTE_REMOVED_KG, AREA_CLEANED_SQM, CO2_AVOIDED_KG, INSPECTION_KM_AVOIDED
    metric_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    provenance provenance_label DEFAULT 'ESTIMATED',
    calculation_basis TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- COMPLAINT_CREATED, WORK_ORDER_ASSIGNED, VERIFICATION_EXECUTED, INSPECTOR_APPROVED
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    integration_name VARCHAR(100) NOT NULL, -- MEDIAMTX, OPEN_METEO, MAPTILER
    config_data JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_org ON complaints(organization_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_master_issues_coords ON master_issues(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_worker ON work_orders(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_evidence_work_order ON evidence(work_order_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hashes_sha ON evidence_hashes(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_evidence_hashes_phash ON evidence_hashes(phash);
CREATE INDEX IF NOT EXISTS idx_verification_runs_wo ON verification_runs(work_order_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource_type, resource_id);

-- 12. ROW-LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_issue_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE camera_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;

-- 13. RLS HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 14. RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Complaints
CREATE POLICY "Citizens can create complaints"
ON complaints FOR INSERT TO authenticated
WITH CHECK (auth.uid() = citizen_id OR citizen_id IS NULL);

CREATE POLICY "Complaints are viewable by owner or staff"
ON complaints FOR SELECT TO authenticated
USING (
    citizen_id = auth.uid() OR
    get_auth_role() IN ('INSPECTOR', 'PROJECT_MANAGER', 'ORGANIZATION_ADMIN', 'AUDITOR', 'SUPER_ADMIN')
);

-- Master Issues
CREATE POLICY "Master issues are publicly viewable"
ON master_issues FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage master issues"
ON master_issues FOR ALL TO authenticated
USING (get_auth_role() IN ('PROJECT_MANAGER', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'));

-- Work Orders
CREATE POLICY "Work orders viewable by assigned staff"
ON work_orders FOR SELECT TO authenticated
USING (
    assigned_worker_id = auth.uid() OR
    inspector_id = auth.uid() OR
    get_auth_role() IN ('PROJECT_MANAGER', 'ORGANIZATION_ADMIN', 'INSPECTOR', 'AUDITOR', 'SUPER_ADMIN')
);

CREATE POLICY "Managers can create and edit work orders"
ON work_orders FOR ALL TO authenticated
USING (get_auth_role() IN ('PROJECT_MANAGER', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'));

-- Evidence
CREATE POLICY "Workers can submit evidence for assigned jobs"
ON evidence FOR INSERT TO authenticated
WITH CHECK (worker_id = auth.uid());

CREATE POLICY "Evidence is viewable by staff"
ON evidence FOR SELECT TO authenticated
USING (
    worker_id = auth.uid() OR
    get_auth_role() IN ('INSPECTOR', 'PROJECT_MANAGER', 'ORGANIZATION_ADMIN', 'AUDITOR', 'SUPER_ADMIN')
);

-- Verification Runs & Steps
CREATE POLICY "Verification results viewable by staff"
ON verification_runs FOR SELECT TO authenticated USING (true);

-- Human Reviews
CREATE POLICY "Inspectors can create human reviews"
ON human_reviews FOR INSERT TO authenticated
WITH CHECK (inspector_id = auth.uid() AND get_auth_role() IN ('INSPECTOR', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'));

-- Notifications
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Audit Events
CREATE POLICY "Auditors and admins view audit logs"
ON audit_events FOR SELECT TO authenticated
USING (get_auth_role() IN ('AUDITOR', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'));
