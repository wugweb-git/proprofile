# 04. MODULES, FUNCTIONS, & FEATURES
**Status:** Unified (v6.0) — Enterprise Scale & Polymath Tooling

---

## 🏗️ 1. SYSTEM MODULES
- **M1: Centralized Knowledge & RAG Memory Pool:** Global data warehouse ingesting telemetry and Spirit Notes, vectorized for semantic search.
- **M2: RBAC Identity & Privacy Core:** Governance layer managing individual workspaces and enforcing discoverability boundaries.
- **M3: Organizational Tenancy Engine:** Isolated corporate workspace for recruiters to configure rubrics and execute searches.
- **M4: RAG Intelligence & Scoring Cortex:** AI engine for deterministic scoring, cross-pollination logic extraction, and pitch drafting.
- **M5: Adaptive Middleware & Presentation Layer:** Next.js edge router for intent-based UI compilation and ephemeral access.

---

## 🧩 2. SUBMODULES & FUNCTIONS

### M1: Centralized Knowledge & RAG Memory Pool
- **M1.1: Multi-Platform Telemetry Pipeline (The Pulse):**
  - `Ingest_Platform_Webhooks`: GitHub, Figma, Substack RSS.
  - `Noise_Filtration_Engine`: Rejects low-signal data (typo fixes).
- **M1.2: Unified Vector & Relational Graph:**
  - `Generate_RAG_Embeddings`: 1536-dimensional embeddings (pgvector).
- **M1.3: Manual Spirit Capture (Quick-In):**
  - `Capture_Raw_Logic`: Mobile-native 3-second entry for voice/text into HOLD layer.

### M2: RBAC Identity & Privacy Core
- **M2.1: The Individual Workspace (The Soul):**
  - `Ingest_Spirit_Note`: Interface for raw philosophies and logic models.
  - `Auto_Taxonomy_Tagging`: LLM assigns Master Spirit Tags.
- **M2.2: Structural Isolation Controller:**
  - `Enforce_Discoverability_State`: RLS and logical filters for matchmaking.

### M3: Organizational Tenancy Engine
- **M3.1: Tenant Configurator:**
  - `Initialize_Corporate_Silo`: Secure environment for proprietary JDs.
- **M3.2: Rubric Matrix Builder:**
  - `Compile_Standardized_Rubric`: Parses messy JDs into evaluation categories.

### M4: RAG Intelligence & Scoring Cortex
- **M4.1: Deterministic Rubric Evaluator:**
  - `Calculate_Match_Score`: Scores individuals against corporate rubrics.
- **M4.2: Context Synthesizer & Pitcher:**
  - `Retrieve_Cross_Pollination_Logic`: Finds non-obvious overlaps (e.g., F&B logic in Fintech).
  - `Generate_Verified_Citation_Pitch`: Drafts pitches with `proof_citation_id`.
- **M4.4: Knowledge Liquidation Engine (The Turbine):**
  - `Identify_Logic_Peaks`: Flags high-density logic commits for content creation.

### M5: Adaptive Middleware & Presentation Layer
- **M5.1: Magic Link Edge Router:**
  - `Intercept_Intent_Parameters`: Reads `?intent=`, `?jd=` to dictate UI tone.
- **M5.2: Dynamic View & UX Compiler:**
  - `Render_Cognitive_Heatmap`: D3.js constellation of skill saturation.
  - `Trigger_Evidence_Fly_ins`: Intersection observers for real-time proof display.
  - `Execute_Gatekeeper_Interrogation`: AI chat for complexity vetting before booking.

---

## 🚨 3. SYSTEM-WIDE REQUIREMENTS
- **Strict Row-Level Security (RLS):** Enforced on every table; `auth.uid() = profile_id`.
- **API Rate Limiting:** Applied to RAG Cortex to prevent cost abuse.
- **Sub-Second Load Times:** Heavy SSR caching; pre-computed pitches and clusters.
