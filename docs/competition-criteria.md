# GROUND0 — Competition Criteria & Compliance Matrix

This document maps the requirements and scoring criteria from the four official hackathon track specifications to Ground0's technical architecture, features, live demonstration proofs, and implementation statuses.

---

## Source Documents Summary

1. **Document 1 (`1iEssnKa...`)**: *Theme: Computer Vision & Visual Intelligence*
   - Focus: Overcoming slow manual inspections, missed anomalies, and inconsistent visual audits through autonomous visual understanding and change detection.
2. **Document 2 (`18AlksTM...`)**: *Theme: Multimodal AI*
   - Focus: Unifying fragmented data streams (text, high-resolution imagery, video, audio voice notes, telemetry, and documents) into a coherent contextual intelligence loop.
3. **Document 3 (`1yH4_2Dx...`)**: *Theme: Agentic AI & Intelligent Systems*
   - Focus: Autonomous multi-step planning, automated duplicate clustering, decentralized worker routing, verification pipelines, and proactive escalation.
4. **Document 4 (`1qIw9Ups...`)**: *Theme: AI for Sustainability*
   - Focus: Verifiable environmental impact monitoring, waste removal verification, road hazard remediation, municipal resource optimization, and transparent carbon/inspection travel avoidance metrics.

---

## Master Compliance & Criteria Matrix

| Criterion / Track Requirement | Ground0 Feature | Proof During Demo | Current Implementation Status | Missing Requirement | Required Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Real-World Visual Challenge (Doc 1)**<br>Automate manual visual inspection & anomaly detection | Ground0 Before/After verification pipeline for municipal and infrastructure maintenance (potholes, illegal dumping, drain blockages) | Live submission of Before & After work order media with automated computer vision verification | Implemented | None | Build robust visual comparison and change metrics in AI service and web UI |
| **Multimodal Inputs (Doc 2)**<br>Seamlessly combine images, video, text, GPS, voice, and weather data | Multimodal Complaint Engine: captures citizen photos/video, GPS coordinates, voice notes, category metadata, and pulls real-time Open-Meteo telemetry | Citizen filing complaint with photo + voice note + automatic GPS + live weather context; Gemini multimodal breakdown | Implemented | None | Support audio upload & visual media extraction with unified Gemini 1.5/2.0 multimodal prompt |
| **Agentic Workflow & Multi-step Execution (Doc 3)**<br>Autonomous planning, reasoning, and multi-agent coordination | Autonomous 8-Stage Verification Pipeline + Master Issue Clustering Agent (deduplication of complaints within spatial/semantic radius) | 20 citizens report the same pothole $\rightarrow$ Ground0 groups them into Master Issue #GR0-420, assigns worker, and triggers verification stages | Implemented | None | Implement automated clustering engine & stateful verification orchestrator |
| **Environmental & Sustainability Impact (Doc 4)**<br>Quantifiable resource optimization and waste reduction tracking | Sustainability Intelligence Engine: Tracks waste mass removed, cleaned areas ($m^2$), avoided travel, and estimated CO2 reduction labeled MEASURED/REPORTED/ESTIMATED | Authority analytics dashboard showing live sustainability telemetry with clear provenance labels | Implemented | None | Build dedicated Sustainability Metrics widget and audit trail in dashboard |
| **Tampering & Anti-Fraud Protection (Docs 1 & 2)**<br>Prevent reuse of photos, spoofed locations, or synthetic proof | Cryptographic SHA-256 + Perceptual (pHash) hashing, EXIF metadata integrity check, capture nonce validation, and spatial geofence matching | Live demo test case: submitting duplicate photo or incorrect scene flags "DUPLICATE / REPLAY EVIDENCE" and "SCENE MISMATCH" | Implemented | None | Implement pHash and feature-matching (ORB/DINOv2) comparison in Python AI service |
| **Human-in-the-Loop Governance (Doc 3)**<br>AI recommends; human authority retains official decision control | Inspector Command Center & Approval Queue: AI generates recommendation and confidence score, human officer inspects and approves/rejects | Inspector reviews side-by-side verification report with interactive difference slider before issuing final sign-off | Implemented | None | Provide granular approval/rejection/request-more-evidence actions with audit logging |
| **Authorized Live Video & Surveillance (Doc 1)**<br>Connect enterprise camera streams for passive monitoring without privacy violations | MediaMTX RTSP/WebRTC camera gateway with real-time frame sampler and automated face/license plate privacy redaction | Live Camera Wall displaying authorized CCTV streams with status, event detection, and privacy blur active | Implemented | None | MediaMTX config + WebRTC player component + privacy-safe edge processing |
| **Tech Stack Compliance (Docs 1–4)**<br>React/Next.js, Node/Python backend, Supabase PostgreSQL, Gemini API | Next.js 14/15 App Router, TypeScript, Tailwind CSS, FastAPI Python AI service, Supabase PostgreSQL with RLS, Google Gemini API | Public GitHub repository, clean monorepo architecture, Dockerized deployment files | Implemented | None | Provide full setup scripts, migrations, seed data, and .env.example |
| **Public Deployment & Documentation (Docs 1–4)**<br>Live URL, complete setup instructions, demo video walkthrough | Vercel deployment for web app, persistent container for AI service, comprehensive README and pitch guide | Verified live URL, working demo scenarios, architecture diagrams, and API docs | Implemented | None | Prepare deployment scripts and pitch deck script |

---

## Mandatory Hackathon Prohibitions & Adherence

| Prohibited Practice | Ground0 Enforcement Mechanism |
| :--- | :--- |
| **Hard-coded fake statistics / mock counters** | All metrics, charts, and counts derive strictly from live SQL queries against Supabase tables (`complaints`, `work_orders`, `verification_runs`). Empty DB shows true empty state. |
| **Unauthorized camera scanning / open proxies** | Cameras strictly restricted to authorized enterprise ONVIF/RTSP feeds added by authenticated Organization Admins. SSRF validation blocks private network scanning. |
| **Facial recognition / invasive surveillance** | Explicitly forbidden in architecture. Incidental faces and vehicle plates are blurred; no biometric identification models exist in the pipeline. |
| **AI making unilateral official decisions** | AI pipeline strictly issues *recommendations* and *risk scores*. Official state transitions (`APPROVED`, `REJECTED`, `REOPENED`) require authenticated human inspector signature. |
| **Exposing server secrets in frontend code** | `SUPABASE_SECRET_KEY`, `GEMINI_API_KEY`, and internal service tokens are kept exclusively in backend environments. Next.js server actions / route handlers proxy protected operations. |
