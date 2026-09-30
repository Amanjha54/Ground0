# GROUND0 — Camera System & Media Gateway Integration

Ground0 integrates authorized enterprise and municipal video surveillance feeds as passive corroborating evidence. This document outlines the protocols, streaming architecture, privacy safeguards, and SSRF security controls.

---

## 1. Camera Architecture & Streaming Pipeline

Ground0 utilizes **MediaMTX** (formerly `rtsp-simple-server`) as a high-performance, zero-latency streaming gateway to bridge industrial camera protocols with modern web browsers and computer vision worker pipelines.

```mermaid
graph LR
    subgraph "Authorized Municipal Infrastructure"
        IPCam["Authorized IP Camera (ONVIF Profile T / RTSP)"]
        PublicFeed["Authorized Municipal Traffic Cam (HLS / RTSPS)"]
    end

    subgraph "Media Gateway (MediaMTX Container)"
        Ingest["RTSP / ONVIF Ingest Engine"]
        Transcode["WebRTC / HLS Transmuxer"]
        Sampler["Frame Sampler Worker"]
        PrivacyFilter["Edge Privacy Redaction (Face/Plate Blur)"]
    end

    subgraph "Ground0 Application Tier"
        WebUI["Command Center Live Camera Wall (WebRTC)"]
        FastAPI["AI Service Frame Buffer"]
        DB["Supabase (Camera Events & Status)"]
    end

    IPCam -->|RTSP / Credentials| Ingest
    PublicFeed -->|RTSPS / HLS| Ingest

    Ingest --> Transcode
    Transcode -->|Ultra-Low Latency WebRTC (<500ms)| WebUI

    Ingest --> Sampler
    Sampler --> PrivacyFilter
    PrivacyFilter -->|Redacted Snapshots| FastAPI
    PrivacyFilter -->|Incident Snapshots| DB
```

---

## 2. Supported Protocols & Capabilities

- **ONVIF (Profile S / T)**: Device discovery, pan-tilt-zoom (PTZ) telemetry, and standardized RTSP endpoint discovery.
- **RTSP / RTSPS**: Low-latency video streaming with digest authentication.
- **WebRTC**: Real-time browser rendering inside the Next.js dashboard with sub-second delay and zero plugin overhead.
- **HLS**: Fallback streaming for legacy devices or low-bandwidth cellular field uplinks.
- **Recorded / Uploaded Video**: MP4/WebM ingestion for localized drone or mobile patrol capture.

---

## 3. Privacy Safeguards & Regulatory Compliance

Ground0 is designed exclusively as an **infrastructure and physical work monitoring platform**, not a citizen surveillance tool. Strict privacy rules are built into the streaming pipeline:

1. **Explicit Prohibition of Facial Recognition**:
   - The platform strictly bars face recognition, personal identification, demographic profiling, and individual tracking algorithms.
2. **Automated Edge Privacy Blur**:
   - Every video frame sampled for AI verification or persistent storage passes through an edge redaction filter running an OpenCV / YOLO detector that applies Gaussian blurring ($\sigma = 15$) over any detected human face and vehicle license plate.
3. **No Unredacted Public Storage**:
   - Only privacy-redacted frames are stored in long-term Supabase storage buckets (`camera-event-snapshots`).

---

## 4. Anti-SSRF & Network Security Controls

Allowing arbitrary camera URLs can expose internal infrastructure to Server-Side Request Forgery (SSRF). Ground0 protects against camera-based attacks via:

- **Strict Role Restriction**: Only authenticated users with the `ORGANIZATION_ADMIN` role can register a new camera endpoint.
- **URL & Hostname Sanitization**:
  - Schemes are restricted to `rtsp://`, `rtsps://`, and `https://`.
  - IP destinations are resolved before connection: IPv4 loopback (`127.0.0.0/8`), link-local (`169.254.0.0/16`), and private RFC 1918 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) are blocked unless routed through an explicitly whitelisted VPN/tunnel adapter.
- **Credential Encryption**: RTSP passwords and ONVIF secrets are encrypted at rest using AES-256-GCM using `CAMERA_ENCRYPTION_KEY` before database insertion. Raw passwords are never returned in client API responses.
