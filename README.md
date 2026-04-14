# Identity Prism Engine (IPE)

An agentic digital proxy for polymaths. IPE is a sophisticated identity orchestration system designed to mirror a user's consciousness, strategic patterns, and professional output through a high-fidelity digital interface.

## 🧪 End-to-End Mock Testing Sprint

The IPE is currently in a "Rigorous Mock Testing" phase, utilizing the **11-Layer Master Profile Schema** as ground truth.

### Phase 1: The "Spirit" Ingestion & Triage
- **Input**: Simulated GitHub commits and Voice Sparks.
- **Action**: Triage raw telemetry in the **HOLD** view.
- **Verification**: Cognitive Heatmap shifts and Socratic Brain analysis.

### Phase 2: The "Temptation" Audit
- **Input**: Low-MVS (Minimum Viable Spirit) Job Descriptions.
- **Action**: Automated audit via the **Complexity Port**.
- **Outcome**: Spirit Decay calculation and automated "Polite Decline" generation.

### Phase 3: The "Magic Link" Adaptive UI
- **Input**: `?intent=architect` or `?intent=founder` URL parameters.
- **Action**: Real-time "Vibe Shift" (Typography, Density, Focus).
- **Verification**: Traceability Stamps showing the **Ancestry of a Thought**.

## 🛠️ Testing Dashboard

Use the floating **Testing Dashboard** (Red Settings Icon) to:
- **Persona Toggle**: Shift between Architect, Founder, and Coach modes.
- **Seed Data**: Inject High/Low complexity JDs into the Port.
- **Simulate Webhooks**: Trigger GitHub commits to test the Metabolism engine.
- **System Theme**: Toggle between Nothing OS 4.0 and Product defaults.

## 🚀 Features

- **Identity Core**: Manage your bio, philosophy, and professional availability.
- **Spirit Engine**: Parse unstructured thoughts into structured identity signals.
- **Neural Traces**: Transparent verification of career milestones and decision logic.
- **Magic Links**: Deploy context-aware, intent-driven digital proxies for specific audiences (Founders, Architects, Coaches).
- **Cognitive Heatmap**: Real-time visualization of skill saturation and systemic fit.
- **Native OS Integration**: Access camera for identity verification and microphone for strategic spark capture (Voice-to-Text).
- **External Sync**: Real-time indexing of professional vectors (LinkedIn, GitHub, Substack).

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Data Viz**: D3.js.
- **State Management**: Zustand & React Context.
- **AI**: Gemini API (Google Generative AI).

## 📦 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file from `.env.example` and set `VITE_GEMINI_API_KEY` for the client and `MONGODB_DATA_API_URL`, `MONGODB_DATA_API_KEY`, `MONGODB_DATA_SOURCE`, and `MONGODB_DB` for Vercel serverless API routes.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 License

MIT License.


## ☁️ Vercel + MongoDB deployment

- The app is configured for SPA rewrites via `vercel.json`.
- Serverless API endpoints:
  - `GET /api/health` - verifies MongoDB connectivity (`ping`).
  - `GET /api/memory?limit=25` - fetches latest memory nodes.
  - `POST /api/memory` - inserts a memory node (`source`, `content`, optional `state` and `tags`).
- In Vercel Project Settings → Environment Variables, configure:
  - `VITE_GEMINI_API_KEY`
  - `MONGODB_DATA_API_URL`
  - `MONGODB_DATA_API_KEY`
  - `MONGODB_DATA_SOURCE` (optional, defaults to `Cluster0`)
  - `MONGODB_DB` (optional, defaults to `proprofile`)
  - `MONGODB_URI` (optional; used for driver-based deployments)

> Security note: never commit raw database credentials to git; rotate any secret that has been shared in plaintext.


Connection-string note: a raw `MONGODB_URI` is for the MongoDB driver. This repository uses Atlas Data API for serverless compatibility, so configure Data API env vars in Vercel.


Note on driver-based URI mode: if you prefer `MONGODB_URI`, add a MongoDB Node driver path in API handlers. Current serverless handlers are Data API based for minimal cold-start and dependency footprint.

Function optimization note: Data API requests are sent through a reused keep-alive HTTPS agent in `api/_lib/mongodb.ts` to reduce connection churn across Vercel function invocations.
