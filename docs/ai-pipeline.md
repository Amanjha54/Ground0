# GROUND0 — AI Verification Pipeline & Multi-Modal Architecture

**Objective**: Convert ambiguous real-world physical evidence into mathematical, cryptographically provable, and explainable audit trails.

---

## 1. The 8-Stage Autonomous Verification Pipeline

When a field worker marks physical work as completed and submits After evidence, Ground0 triggers an asynchronous multi-stage evaluation pipeline:

```
[Start Verification Pipeline]
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ Stage 1: Evidence Integrity Check                      │
│ - Check capture session timestamp & nonce validity     │
│ - Compute SHA-256 and pHash (perceptual hash)          │
│ - Compare with historical hash database (replay check) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 2: Location Verification                         │
│ - Compare capture GPS coordinates with work order site │
│ - Compute Haversine distance & geofence threshold (<50m)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 3: Scene Identity & Homography Matching          │
│ - Extract deep visual embeddings (DINOv2 / SigLIP)     │
│ - Match static landmark keypoints (ORB / SIFT homography)│
│ - Verify Before & After are the SAME physical place    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 4: Physical Change Detection                     │
│ - Align Before and After images via homography         │
│ - Compute difference mask & SSIM                       │
│ - Measure defect reduction (pothole filled / garbage cleared) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 5: Work Order Requirement Verification           │
│ - Multimodal Gemini reasoning on aligned evidence pair │
│ - Evaluate against explicit work order completion rules│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 6: Optional CCTV Cross-Correlation               │
│ - Query authorized cameras within spatial radius       │
│ - Inspect timestamped surveillance frames for activity │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 7: Risk Analysis & Anomaly Synthesis             │
│ - Aggregate confidence metrics, weather, lighting      │
│ - Tag risk flags: REPLAY, MISMATCH, GEOFENCE_DRIFT     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 8: Inspector Recommendation Generation           │
│ - Synthesize human-readable justification              │
│ - Set recommendation: READY_FOR_APPROVAL or ESCALATE   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Model Roles & Technical Justifications

| Component | Architecture / Technology | Specific Responsibility in Ground0 | Why Technically Justified |
| :--- | :--- | :--- | :--- |
| **Semantic Multimodal Reasoning** | **Google Gemini 1.5/2.0** | Intake classification, visual triage, requirement validation against natural language contracts, and explaining findings to human inspectors. | Unmatched multimodal reasoning across high-resolution imagery, complex natural language municipal criteria, and audio transcripts. |
| **Scene Representation & Identity** | **DINOv2 (Vision Transformer) / SigLIP** | Generates a 768-dim dense semantic vector of scene background structures. | Self-supervised features remain robust under drastic lighting changes, weather shifts, and seasonal variations where traditional pixel diffs fail. |
| **Geometric Homography & Keypoints** | **OpenCV (ORB / SIFT / RANSAC)** | Perspective transformation to project the After image into the exact camera frame coordinate system of the Before image. | Essential for pixel-level difference masks and verifying camera perspective consistency. |
| **Perceptual Tamper Detection** | **ImageHash (pHash / dHash)** | 64-bit frequency-domain structural fingerprinting. | Instantly catches recycled photos even if resized, re-compressed, or stripped of EXIF data. |
| **Contextual Telemetry** | **Open-Meteo API** | Fetches historical hourly rainfall, cloud cover, and solar irradiance for the capture coordinates. | Prevents false fraud alerts caused by sudden rainstorms, wet pavement, or sunset shadows. |

---

## 3. Asynchronous Execution & Realtime Lifecycle States

Verification jobs execute asynchronously in the Python AI microservice. As each stage executes, the corresponding `verification_steps` record is updated in PostgreSQL, triggering Supabase Realtime WebSocket events directly to the inspector's browser:

1. `QUEUED`: Job received and placed in processing queue.
2. `PREPROCESSING`: Image normalization, perspective correction, EXIF extraction.
3. `INTEGRITY_CHECK`: Cryptographic and perceptual hash validation.
4. `LOCATION_CHECK`: Geospatial distance computation.
5. `SCENE_ANALYSIS`: Deep feature embedding comparison.
6. `CHANGE_ANALYSIS`: Defect reduction measurement and mask generation.
7. `REQUIREMENT_ANALYSIS`: Gemini multimodal criteria evaluation.
8. `CAMERA_ANALYSIS`: CCTV temporal cross-referencing.
9. `RISK_ANALYSIS`: Flag aggregation and confidence synthesis.
10. `FINALIZING`: Persisting diff artifacts and recommendation report.
11. `COMPLETED`: Ready for human inspector sign-off.
12. `FAILED`: Anomaly requiring manual investigation.
