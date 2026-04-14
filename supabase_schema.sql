-- ==============================================================================
-- POLYMATH IDENTITY PRISM: MULTI-TENANT RAG ENGINE (SUPABASE SCHEMA)
-- ==============================================================================

-- Enable the pgvector extension to work with openai embeddings
CREATE EXTENSION IF NOT EXISTS vector;
-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- M2 & M3: RBAC IDENTITY AND TENANCY ENGINE
-- ==============================================================================

-- Corporate Silos (Recruiting companies analyzing targets)
CREATE TABLE public.organizations (
    tenant_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Individual Polymath Profiles (The M2 Workspace)
CREATE TABLE public.polymath_profiles (
    profile_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    is_searchable BOOLEAN DEFAULT TRUE, -- Discoverability Toggle (M2.3)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Proprietary Job Descriptions (Isolated to Tenant)
CREATE TABLE public.corporate_rubrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES public.organizations(tenant_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    raw_jd_text TEXT NOT NULL,
    standardized_rubric JSONB, -- Parsed output via M3.2
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- M1.2: UNIFIED VECTOR & RELATIONAL GRAPH (ATOMIC UNITS OF THINKING)
-- Based on Addendum A
-- ==============================================================================

CREATE TABLE public.atomic_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.polymath_profiles(profile_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    insight_type VARCHAR(50) NOT NULL, -- Enum: 'Idea', 'Case', 'Experiment', 'Logic Leap'
    layer VARCHAR(50), -- Enum: 'Product', 'System', 'Business'
    spirit_tags TEXT[], -- e.g. ["Systemic Unfucking", "0->1"]
    embedding vector(1536), -- Vector representation for RAG Intelligence (M4)
    source_telemetry VARCHAR(255), -- Where did it come from? e.g., 'Github Commit', 'Voice Note'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.synthesis_patterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.polymath_profiles(profile_id) ON DELETE CASCADE,
    pattern_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    complexity_level INTEGER CHECK (complexity_level >= 1 AND complexity_level <= 10),
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Pivot table linking raw insights to synthesized patterns
CREATE TABLE public.pattern_insight_links (
    pattern_id UUID REFERENCES public.synthesis_patterns(id) ON DELETE CASCADE,
    insight_id UUID REFERENCES public.atomic_insights(id) ON DELETE CASCADE,
    PRIMARY KEY (pattern_id, insight_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR STRICT ISOLATION
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polymath_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atomic_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synthesis_patterns ENABLE ROW LEVEL SECURITY;

-- Polymath Rules
-- Individuals only see/edit their own atomic insights
CREATE POLICY "owner_insights_access" ON public.atomic_insights
    FOR ALL USING (profile_id IN (SELECT profile_id FROM public.polymath_profiles WHERE user_id = auth.uid()));

CREATE POLICY "owner_patterns_access" ON public.synthesis_patterns
    FOR ALL USING (profile_id IN (SELECT profile_id FROM public.polymath_profiles WHERE user_id = auth.uid()));

-- Organization Rules
-- Corporate Tenancy isolation (cannot query other companies JDs)
CREATE POLICY "tenant_rubric_isolation" ON public.corporate_rubrics
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.organizations WHERE domain = current_setting('request.jwt.claims')::json->>'domain'));

-- Global RAG Matcher Rules
-- The M4 engine can SELECT insights globally *ONLY IF* the polymath marks is_searchable = TRUE
CREATE POLICY "rag_public_discovery" ON public.atomic_insights
    FOR SELECT USING (profile_id IN (SELECT profile_id FROM public.polymath_profiles WHERE is_searchable = TRUE));

-- Create Vector Index for hyper-fast cosine similarity (M4.1)
CREATE INDEX idx_atomic_insights_embedding ON public.atomic_insights USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
