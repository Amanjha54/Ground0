# GROUND0

**Tagline:** *Verify the Work. Reveal the Reality.*

---

## Project Purpose

**Ground0** is an AI-powered Proof of Physical Work platform engineered to bridge physical municipal/civil remediation with mathematical, cryptographically provable verification. 

When a contractor claims physical work has been completed (such as repairing a roadway cavity, clearing illegal solid waste, or unclogging a culvert drain), Ground0 verifies:
- Evidence integrity (freshness, nonces, and anti-replay protection)
- Physical location and geofence adherence
- Scene identity and topological consistency (same physical location)
- Quantifiable physical change detection
- Satisfaction of work order criteria
- Final human inspector sign-off before transparent citizen closure

---

## Planned Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **3D UI:** Three.js, React Three Fiber, Drei
- **Database / Auth / Storage:** Supabase (PostgreSQL, PostGIS, Row-Level Security, Storage, Realtime)
- **Backend:** Python, FastAPI
- **AI & Computer Vision:** Google Gemini API, OpenCV, PyTorch, DINOv2 / scene-matching models
- **Maps:** MapLibre GL, MapTiler

---

## Planned Development Phases

1. **Phase 0:** Repository and documentation
2. **Phase 1:** Supabase database and RLS
3. **Phase 2:** Authentication
4. **Phase 3:** Citizen complaint system
5. **Phase 4:** Duplicate complaint detection
6. **Phase 5:** Authority dashboard
7. **Phase 6:** Work orders
8. **Phase 7:** Worker evidence capture
9. **Phase 8:** FastAPI backend
10. **Phase 9:** Evidence integrity
11. **Phase 10:** Location verification
12. **Phase 11:** Scene matching
13. **Phase 12:** Physical-change detection
14. **Phase 13:** Verification orchestration
15. **Phase 14:** Human review
16. **Phase 15:** Citizen resolution and reopening
17. **Phase 16:** Maps
18. **Phase 17:** Authorized cameras
19. **Phase 18:** Analytics and notifications
20. **Phase 19:** Premium 3D/VFX frontend
21. **Phase 20:** Security testing
22. **Phase 21:** Deployment

---

## Security Notice

> **CRITICAL SECURITY WARNING:**  
> Never commit real secrets, API keys, private keys, or credentials to version control. All sensitive keys (`SUPABASE_SECRET_KEY`, `GEMINI_API_KEY`, encryption keys, and internal service tokens) must reside exclusively in local uncommitted environment files (`.env.local`) or protected deployment secret stores.
