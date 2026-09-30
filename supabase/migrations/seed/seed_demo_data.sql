-- ====================================================================
-- GROUND0: PRODUCTION SEED DATA
-- High-fidelity data for Hackathon Live Demo & Real-World Simulation
-- ====================================================================

-- 1. Organizations
INSERT INTO organizations (id, name, slug, type, contact_email)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Metropolitan Public Works Department', 'metro-pwd', 'MUNICIPALITY', 'pwd@metro.gov'),
    ('22222222-2222-2222-2222-222222222222', 'Apex Civil Infrastructure Contractors', 'apex-civil', 'CONTRACTOR', 'dispatch@apexcivil.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Sites & Assets
INSERT INTO sites (id, organization_id, name, code, description, latitude, longitude, radius_meters)
VALUES
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Downtown Central Corridor - Ward 4', 'DCC-W4', 'High density urban commercial and transit artery', 37.774929, -122.419418, 500.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO assets (id, site_id, name, asset_type, latitude, longitude)
VALUES
    ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Market St & 7th Ave Roadway Surface', 'ROAD_SEGMENT', 37.775100, -122.419200),
    ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Mission Culvert Drainage Basin A', 'DRAINAGE_CULVERT', 37.774500, -122.419600)
ON CONFLICT (id) DO NOTHING;

-- 3. Master Issues
INSERT INTO master_issues (id, organization_id, issue_code, category, title, description, latitude, longitude, address, severity, total_reports, status)
VALUES
    ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'GR0-420', 'POTHOLE', 'Severe Roadway Cavity on Market & 7th', 'Deep 15cm pothole causing vehicular damage and safety hazards near pedestrian crosswalk', 37.775120, -122.419210, '701 Market St, San Francisco, CA', 'HIGH', 17, 'WORK_ORDER_CREATED'),
    ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'GR0-421', 'GARBAGE', 'Illegal Commercial Waste Accumulation', 'Large dump of discarded construction drywall and packaging obstructing public sidewalk', 37.774600, -122.419700, '350 Mission St, San Francisco, CA', 'CRITICAL', 8, 'TRIAGED')
ON CONFLICT (id) DO NOTHING;

-- 4. Complaints
INSERT INTO complaints (id, tracking_number, organization_id, master_issue_id, category, description, latitude, longitude, address, severity, status, ai_predicted_category, ai_confidence, ai_severity, duplicate_cluster_score)
VALUES
    ('88888888-8888-8888-8888-888888888888', 'GR0-2941', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'POTHOLE', 'Front tire hit a massive pothole in middle of lane. Sharp edges exposed.', 37.775115, -122.419205, '701 Market St, San Francisco, CA', 'HIGH', 'WORK_ORDER_CREATED', 'POTHOLE', 0.94, 'HIGH', 0.98),
    ('88888888-8888-8888-8888-888888888889', 'GR0-2942', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'POTHOLE', 'Dangerous hole right outside the bus stop. Cyclists swerving into traffic.', 37.775130, -122.419220, '705 Market St, San Francisco, CA', 'HIGH', 'LINKED_TO_MASTER', 'POTHOLE', 0.92, 'HIGH', 0.96)
ON CONFLICT (id) DO NOTHING;

-- 5. Work Orders
INSERT INTO work_orders (id, organization_id, master_issue_id, site_id, asset_id, work_order_number, title, description, category, priority, status, start_date, deadline, camera_verification_enabled)
VALUES
    ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'WO-2091', 'Rapid Asphalt Patch & Compaction on Market St', 'Saw-cut edges, excavate debris, fill with hot-mix asphalt (HMA), compact to flush grade, and apply edge sealant.', 'POTHOLE', 'HIGH', 'IN_PROGRESS', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '24 hours', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. Work Order Requirements
INSERT INTO work_order_requirements (id, work_order_id, title, description, criterion_type, is_mandatory)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'Total Cavity Backfill & Leveling', 'Cavity must be completely filled flush with surrounding roadway grade without depressions > 5mm.', 'SURFACE_REPAIR', TRUE),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '99999999-9999-9999-9999-999999999999', 'Perimeter Thermal Sealing', 'Bituminous liquid asphalt sealant applied along all joint interfaces to prevent moisture penetration.', 'SEALING', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Municipal CCTV Cameras
INSERT INTO cameras (id, organization_id, site_id, name, stream_url_encrypted, webrtc_path, latitude, longitude, direction_heading_degrees, is_online, privacy_blur_enabled)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'CAM-01 Market & 7th Traffic Pole North', 'rtsps://cam01.metro.internal/live', 'cam01_market_7th', 37.775150, -122.419180, 210.0, TRUE, TRUE),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'CAM-02 Mission Culvert Basin Monitoring', 'rtsps://cam02.metro.internal/live', 'cam02_mission_culvert', 37.774480, -122.419620, 45.0, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Environmental Sustainability Metrics
INSERT INTO environmental_metrics (id, work_order_id, metric_type, metric_value, unit, provenance, calculation_basis)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '99999999-9999-9999-9999-999999999999', 'INSPECTION_KM_AVOIDED', 34.5, 'km', 'MEASURED', 'Automated AI visual verification eliminated round-trip municipal inspector van deployment'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '99999999-9999-9999-9999-999999999999', 'CO2_AVOIDED_KG', 7.42, 'kg_CO2e', 'ESTIMATED', 'Avoided vehicle transit combustion based on EPA standard 215g CO2/km')
ON CONFLICT (id) DO NOTHING;
