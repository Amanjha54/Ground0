import {
  Complaint,
  MasterIssue,
  WorkOrder,
  Evidence,
  VerificationRun,
  Camera,
  EnvironmentalMetric,
  AuditEvent,
  UserRole,
  HumanReviewDecision
} from '@ground0/types';

// Pre-seeded initial data matching supabase/seed/seed_demo_data.sql
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: '88888888-8888-8888-8888-888888888888',
    tracking_number: 'GR0-2941',
    organization_id: '11111111-1111-1111-1111-111111111111',
    master_issue_id: '66666666-6666-6666-6666-666666666666',
    category: 'POTHOLE',
    description: 'Front tire hit a massive pothole in middle of lane. Sharp edges exposed.',
    latitude: 37.775115,
    longitude: -122.419205,
    address: '701 Market St, San Francisco, CA',
    severity: 'HIGH',
    status: 'WORK_ORDER_CREATED',
    ai_predicted_category: 'POTHOLE',
    ai_confidence: 0.94,
    ai_severity: 'HIGH',
    ai_notes: 'Severe asphalt cavity with sharp jagged boundaries directly on transit artery.',
    duplicate_cluster_score: 0.98,
    weather_context: { condition: 'Clear', temp_c: 18.5, rainfall_mm: 0.0 },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    media: [
      {
        id: 'med-01',
        complaint_id: '88888888-8888-8888-8888-888888888888',
        storage_path: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        file_size_bytes: 1420500,
        sha256_hash: 'a9b8c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234',
        is_primary: true,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ]
  },
  {
    id: '88888888-8888-8888-8888-888888888889',
    tracking_number: 'GR0-2942',
    organization_id: '11111111-1111-1111-1111-111111111111',
    master_issue_id: '66666666-6666-6666-6666-666666666666',
    category: 'POTHOLE',
    description: 'Dangerous hole right outside the bus stop. Cyclists swerving into traffic.',
    latitude: 37.775130,
    longitude: -122.419220,
    address: '705 Market St, San Francisco, CA',
    severity: 'HIGH',
    status: 'LINKED_TO_MASTER',
    ai_predicted_category: 'POTHOLE',
    ai_confidence: 0.92,
    ai_severity: 'HIGH',
    ai_notes: 'Duplicate detection confirmed within 12 meters of GR0-2941.',
    duplicate_cluster_score: 0.96,
    weather_context: { condition: 'Clear', temp_c: 19.1, rainfall_mm: 0.0 },
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_MASTER_ISSUES: MasterIssue[] = [
  {
    id: '66666666-6666-6666-6666-666666666666',
    organization_id: '11111111-1111-1111-1111-111111111111',
    issue_code: 'GR0-420',
    category: 'POTHOLE',
    title: 'Severe Roadway Cavity on Market & 7th',
    description: 'Deep 15cm pothole causing vehicular damage and safety hazards near pedestrian crosswalk. Clustered from 17 citizen reports.',
    latitude: 37.775120,
    longitude: -122.419210,
    address: '701 Market St, San Francisco, CA',
    severity: 'HIGH',
    total_reports: 17,
    status: 'WORK_ORDER_CREATED',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    organization_id: '11111111-1111-1111-1111-111111111111',
    issue_code: 'GR0-421',
    category: 'GARBAGE',
    title: 'Illegal Commercial Waste Accumulation',
    description: 'Large dump of discarded construction drywall and packaging obstructing public sidewalk.',
    latitude: 37.774600,
    longitude: -122.419700,
    address: '350 Mission St, San Francisco, CA',
    severity: 'CRITICAL',
    total_reports: 8,
    status: 'TRIAGED',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    organization_id: '11111111-1111-1111-1111-111111111111',
    master_issue_id: '66666666-6666-6666-6666-666666666666',
    site_id: '33333333-3333-3333-3333-333333333333',
    asset_id: '44444444-4444-4444-4444-444444444444',
    work_order_number: 'WO-2091',
    title: 'Rapid Asphalt Patch & Compaction on Market St',
    description: 'Saw-cut edges, excavate debris, fill with hot-mix asphalt (HMA), compact to flush grade, and apply edge sealant.',
    category: 'POTHOLE',
    priority: 'HIGH',
    contractor_id: '22222222-2222-2222-2222-222222222222',
    status: 'UNDER_INSPECTION',
    start_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    deadline: new Date(Date.now() + 3600000 * 20).toISOString(),
    camera_verification_enabled: true,
    verification_policy: { min_scene_match: 0.80, min_change_score: 0.75 },
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    requirements: [
      {
        id: 'req-01',
        work_order_id: '99999999-9999-9999-9999-999999999999',
        title: 'Total Cavity Backfill & Leveling',
        description: 'Cavity must be completely filled flush with surrounding roadway grade without depressions > 5mm.',
        criterion_type: 'SURFACE_REPAIR',
        is_mandatory: true,
        is_satisfied: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'req-02',
        work_order_id: '99999999-9999-9999-9999-999999999999',
        title: 'Perimeter Thermal Sealing',
        description: 'Bituminous liquid asphalt sealant applied along all joint interfaces to prevent moisture penetration.',
        criterion_type: 'SEALING',
        is_mandatory: true,
        is_satisfied: true,
        created_at: new Date().toISOString(),
      }
    ]
  }
];

export const INITIAL_VERIFICATION_RUNS: VerificationRun[] = [
  {
    id: 'vr-901',
    work_order_id: '99999999-9999-9999-9999-999999999999',
    status: 'COMPLETED',
    current_stage: 'RECOMMENDATION',
    overall_confidence: 0.942,
    risk_score: 0.058,
    ai_recommendation: 'READY_FOR_APPROVAL',
    explanation_summary: 'Ground0 Verification: Location verified (4.2m delta), Scene Match 94.1%, Fresh Evidence confirmed, Physical Change 91.4%, Requirements satisfied. Risk Level: LOW. Ready for human inspector sign-off.',
    started_at: new Date(Date.now() - 1800000).toISOString(),
    completed_at: new Date(Date.now() - 1200000).toISOString(),
    result: {
      id: 'res-901',
      verification_run_id: 'vr-901',
      scene_match_percentage: 94.1,
      physical_change_percentage: 91.4,
      requirement_score: 0.95,
      difference_mask_storage_path: '/artifacts/diff_mask_sample.png',
      heatmap_storage_path: '/artifacts/heatmap_sample.png',
      side_by_side_artifact_path: '/artifacts/side_by_side.png',
      gemini_audit_report: 'Multimodal inspection confirms full cavity backfill. Asphalt compaction is flush with ambient road grade. No residual gravel hazard observed.'
    },
    steps: [
      { id: 's1', verification_run_id: 'vr-901', step_name: 'INTEGRITY_CHECK', step_order: 1, status: 'PASSED', score: 1.0 },
      { id: 's2', verification_run_id: 'vr-901', step_name: 'LOCATION_CHECK', step_order: 2, status: 'PASSED', score: 0.98 },
      { id: 's3', verification_run_id: 'vr-901', step_name: 'SCENE_MATCH', step_order: 3, status: 'PASSED', score: 0.94 },
      { id: 's4', verification_run_id: 'vr-901', step_name: 'CHANGE_DETECTION', step_order: 4, status: 'PASSED', score: 0.91 },
      { id: 's5', verification_run_id: 'vr-901', step_name: 'REQUIREMENT_ANALYSIS', step_order: 5, status: 'PASSED', score: 0.95 },
      { id: 's6', verification_run_id: 'vr-901', step_name: 'CAMERA_CORROBORATION', step_order: 6, status: 'PASSED', score: 0.89 },
      { id: 's7', verification_run_id: 'vr-901', step_name: 'RISK_ANALYSIS', step_order: 7, status: 'PASSED', score: 0.94 },
      { id: 's8', verification_run_id: 'vr-901', step_name: 'RECOMMENDATION', step_order: 8, status: 'PASSED', score: 0.94 }
    ],
    risk_flags: []
  }
];

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    organization_id: '11111111-1111-1111-1111-111111111111',
    name: 'CAM-01 Market & 7th Traffic Pole North',
    stream_url_encrypted: 'rtsps://cam01.metro.internal/live',
    webrtc_path: 'cam01_market_7th',
    latitude: 37.775150,
    longitude: -122.419180,
    direction_heading_degrees: 210.0,
    is_online: true,
    last_heartbeat: new Date().toISOString(),
    privacy_blur_enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    organization_id: '11111111-1111-1111-1111-111111111111',
    name: 'CAM-02 Mission Culvert Basin Monitoring',
    stream_url_encrypted: 'rtsps://cam02.metro.internal/live',
    webrtc_path: 'cam02_mission_culvert',
    latitude: 37.774480,
    longitude: -122.419620,
    direction_heading_degrees: 45.0,
    is_online: true,
    last_heartbeat: new Date().toISOString(),
    privacy_blur_enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cam-03',
    organization_id: '11111111-1111-1111-1111-111111111111',
    name: 'CAM-03 8th & Market Transit Overlook',
    stream_url_encrypted: 'rtsps://cam03.metro.internal/live',
    webrtc_path: 'cam03_8th_market',
    latitude: 37.776100,
    longitude: -122.418200,
    direction_heading_degrees: 180.0,
    is_online: true,
    last_heartbeat: new Date().toISOString(),
    privacy_blur_enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cam-04',
    organization_id: '11111111-1111-1111-1111-111111111111',
    name: 'CAM-04 Civic Center Plaza Peripheral',
    stream_url_encrypted: 'rtsps://cam04.metro.internal/live',
    webrtc_path: 'cam04_civic_center',
    latitude: 37.779200,
    longitude: -122.417800,
    direction_heading_degrees: 90.0,
    is_online: false,
    last_heartbeat: new Date(Date.now() - 3600000 * 5).toISOString(),
    privacy_blur_enabled: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SUSTAINABILITY: EnvironmentalMetric[] = [
  {
    id: 'm1',
    work_order_id: '99999999-9999-9999-9999-999999999999',
    metric_type: 'INSPECTION_KM_AVOIDED',
    metric_value: 34.5,
    unit: 'km',
    provenance: 'MEASURED',
    calculation_basis: 'Automated AI visual verification eliminated round-trip municipal inspector van deployment',
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    work_order_id: '99999999-9999-9999-9999-999999999999',
    metric_type: 'CO2_AVOIDED_KG',
    metric_value: 7.42,
    unit: 'kg_CO2e',
    provenance: 'ESTIMATED',
    calculation_basis: 'Avoided vehicle transit combustion based on EPA standard 215g CO2/km',
    created_at: new Date().toISOString()
  },
  {
    id: 'm3',
    work_order_id: '99999999-9999-9999-9999-999999999999',
    metric_type: 'WASTE_REMOVED_KG',
    metric_value: 320.0,
    unit: 'kg',
    provenance: 'MEASURED',
    calculation_basis: 'Weighed municipal transfer station manifest on site',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud-01',
    action: 'COMPLAINT_FILED',
    resource_type: 'complaint',
    resource_id: '88888888-8888-8888-8888-888888888888',
    details: { tracking_number: 'GR0-2941', category: 'POTHOLE' },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'aud-02',
    action: 'MASTER_ISSUE_CLUSTERED',
    resource_type: 'master_issue',
    resource_id: '66666666-6666-6666-6666-666666666666',
    details: { issue_code: 'GR0-420', report_count: 17 },
    created_at: new Date(Date.now() - 3600000 * 23).toISOString()
  },
  {
    id: 'aud-03',
    action: 'WORK_ORDER_DISPATCHED',
    resource_type: 'work_order',
    resource_id: '99999999-9999-9999-9999-999999999999',
    details: { work_order_number: 'WO-2091', contractor: 'Apex Civil' },
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'aud-04',
    action: 'AI_VERIFICATION_COMPLETED',
    resource_type: 'verification_run',
    resource_id: 'vr-901',
    details: { confidence: 0.942, recommendation: 'READY_FOR_APPROVAL' },
    created_at: new Date(Date.now() - 1200000).toISOString()
  }
];
