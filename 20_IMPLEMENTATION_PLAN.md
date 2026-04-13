# 20. IMPLEMENTATION PLAN — ROADMAP
**Status:** Locked — 8-Week Sprint Plan
**Core Identity:** Database-First, UI-Last Philosophy.

---

## ⚙️ PHASE 1: FOUNDATION & THE SOUL (Weeks 1-2)
- **Goal:** Establish the secure, multi-tenant memory core.
- **Tasks:**
  - Initialize project and connect to Supabase.
  - Execute SQL migrations for the 5-layer memory schema.
  - Implement and test Row Level Security (RLS).
  - Build basic CRUD UI for "Spirit Note" ingestion and Experience Matrix.

## ⚙️ PHASE 2: LIVE PIPELINES & THE PULSE (Weeks 3-4)
- **Goal:** Eliminate manual portfolio updates.
- **Tasks:**
  - Set up n8n/Make.com webhooks for GitHub and Substack.
  - Write Supabase Edge Functions for automatic vectorization (pgvector).
  - Integrate "Semantic Classifier" LLM prompt for auto-tagging.

## ⚙️ PHASE 3: THE BRAIN & ADAPTIVE UI (Weeks 5-6)
- **Goal:** Build the Intelligent Proxy logic.
- **Tasks:**
  - Develop JD Matcher algorithm (Vector Search + LLM Synthesis).
  - Implement Edge Middleware for URL parameter interception (`?jd=`, `?mode=`).
  - Build 3 UI themes (Architect, Founder, Coach).
  - Wire up Framer Motion for "Snap-to-Point" observers.

## ⚙️ PHASE 4: DATA VISUALIZATION & POLISH (Weeks 7-8)
- **Goal:** Finalize "Proof of Intelligence" features.
- **Tasks:**
  - Develop clustering logic and D3.js Cognitive Heatmap.
  - Implement API Rate Limiting for JD Matcher.
  - Onboard "Tenant Zero" (Vedanshu) and verify cross-pollinated pitches.

---

## 🛠️ THE ENGINEERING PROCESS
- **Architecture-Driven Development (ADD):** No UI components are built until the underlying Supabase schema and JSON payloads are locked and tested.
- **LLM "Prompt-First" Testing:** Prompts for JD Matcher and Semantic Classifier must be tested extensively in playgrounds before automation.
- **Strict State Isolation:** Frontend state must never cache cross-tenant data. Use React Server Components (RSC) for direct fetching.
- **Continuous Deployment (CI/CD):** Every push to main automatically deploys a preview environment.
- **The "Proof of Human Logic" Audit:** Every LLM integration must contain `proof_citation_id` logic.
