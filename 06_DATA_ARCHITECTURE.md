# 06. DATA ARCHITECTURE — THE MEMORY SCHEMA
**Status:** Locked (v6.0) — Atomic Units of Thinking
**Database:** Supabase (Postgres) + pgvector

---

## 🧠 1. ATOMIC ENTITY DEFINITIONS
Stop storing "Documents"; Start storing "Atomic Units of Thinking."

- **Entity: Insight**
  - `type`: Idea / Case / Experiment / Logic Leap
  - `layer`: Product / System / Business
  - `spirit_tag`: e.g., [Systemic Unfucking]
- **Entity: System**
  - `complexity_level`: 1-10
  - `patterns_involved`: Links to Entity: Pattern
- **Entity: Pattern (The Synthesis Layer)**
  - `purpose`: AI-generated clusters proving "Specialist in Complexity" status.

---

## 📂 2. CORE SQL SCHEMA

| Table Name | Purpose | Key Data Fields |
|---|---|---|
| `identity_pillars` | The "Soul" (Static) | Spirit Statement, Industry Tags, Philosophy Nodes. |
| `experience_matrix` | High-Signal Archive | Role, Era, Cross-Domain Logic, AI reflections. |
| `activity_stream` | The "Pulse" (Live) | Title, URL, Platform, pgvector Embeddings. |
| `curated_activity` | The "Likes" (Inspiration) | Scraped link, "Why I Liked This" note, Tags. |
| `intent_overrides` | Adaptive Logic | Role-specific Bio, CSS Themes, Priority Tags. |
| `job_leads` | Proactive Search | JD Text, Company, Match Score. |
| `ephemeral_pitches` | The Output | Generated Token, Custom Pitch, Expiry. |

---

## ⚙️ 3. SYSTEM RULES
- **Pattern Promotion Rule:** If a theme appears in 3+ SIGNALS, the system triggers a "Pattern Nudge."
- **Forced Linking Rule:** A SIGNAL must connect to at least 1 SYSTEM or 1 PATTERN.
- **Synaptic Pruning:** Auto-archive old nodes that dilute the current Directional Vector.
- **Traceability Chain:** Every claim stores a `proof_citation_id` linking to raw telemetry.
