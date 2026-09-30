# GROUND0 — Development Plan & Execution Roadmap

This document outlines the sequential, phase-by-phase implementation plan for Ground0.

---

## Master Development Sequence

### Phase 0: Repository and documentation
- Repository structure definition, toolchain configuration, baseline documentation, threat modeling, and development plan.

### Phase 1: Supabase database and RLS
- PostgreSQL schema creation, entity relationships, custom enum types, indexes, and Row-Level Security (RLS) policies.

### Phase 2: Authentication
- Supabase Auth integration, multi-role profile mapping (`CITIZEN`, `FIELD_WORKER`, `CONTRACTOR`, `INSPECTOR`, `PROJECT_MANAGER`, `ORGANIZATION_ADMIN`, `AUDITOR`, `SUPER_ADMIN`), and session security.

### Phase 3: Citizen complaint system
- Multimodal intake workflows: photo/video evidence capture, geolocation tagging, category selection, and descriptions.

### Phase 4: Duplicate complaint detection
- Geospatial clustering and visual embedding similarity to combine duplicate citizen reports into Master Issues.

### Phase 5: Authority dashboard
- Command center for municipal officials to review complaints, triage priorities, monitor clusters, and manage workflows.

### Phase 6: Work orders
- Formal work order generation, scope of work definition, contractor assignment, and mandatory verifiable criteria.

### Phase 7: Worker evidence capture
- Mobile-first PWA capture interface with server nonce challenges and multi-angle capture workflows.

### Phase 8: FastAPI backend
- Asynchronous Python microservice architecture for computer vision and multimodal verification tasks.

### Phase 9: Evidence integrity
- Cryptographic SHA-256 fingerprinting, 64-bit perceptual hashing (pHash), and replay attack prevention.

### Phase 10: Location verification
- Haversine distance calculations and strict geofence perimeter validation against work order coordinates.

### Phase 11: Scene matching
- Feature keypoint matching (ORB/SIFT) and DINOv2 visual embeddings to verify that Before and After media depict the same physical location.

### Phase 12: Physical-change detection
- Homography-aligned difference masks, morphological contours, and defect reduction measurement.

### Phase 13: Verification orchestration
- Asynchronous pipeline coordinating all verification stages and generating structured audit summaries.

### Phase 14: Human review
- Inspector review console displaying verification reports, confidence scores, and action controls (`APPROVE`, `REJECT`, `REQUEST_MORE_EVIDENCE`).

### Phase 15: Citizen resolution and reopening
- Transparent public closure portal featuring interactive Before/After sliders and citizen confirmation/dispute actions.

### Phase 16: Maps
- MapLibre GL spatial mesh displaying live complaint markers, master clusters, work order assets, and camera locations.

### Phase 17: Authorized cameras
- MediaMTX streaming gateway integration for authorized RTSP/WebRTC municipal feeds with automated edge privacy redaction.

### Phase 18: Analytics and notifications
- Municipal KPIs, carbon/travel avoidance telemetry with strict provenance labels (`MEASURED`, `REPORTED`, `ESTIMATED`), and in-app realtime notifications.

### Phase 19: Premium 3D/VFX frontend
- Three.js / React Three Fiber interactive digital twin smart-city visualization with accessible reduced-motion support.

### Phase 20: Security testing
- End-to-end security audits, SSRF prevention testing, RLS boundary verification, and tamper detection benchmarks.

### Phase 21: Deployment
- Containerized Docker setup, Next.js deployment configuration, persistent backend service orchestration, and production readiness checks.
