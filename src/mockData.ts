import { SystemProof, IntelligenceInsight, TraceLog, PulseItem, TemporalNode, Experiment, DirectionalVector, Identity, AudioInsight, Signal } from './types';

export const MOCK_IDENTITY: Identity = {
  name: 'Vedanshu Srivastava',
  headline: 'I architect clarity from complexity.',
  bio: 'I don’t design interfaces. I work on decisions, systems, and leverage. I work on systems that don’t work the way they should. Not from the surface — but from how they are actually structured.',
  industry: 'Product × Systems × AI',
  tags: ['0→1 Orchestration', 'Systemic Unfucking', 'Cross-Domain Synthesis'],
  signalLine: 'Product × Systems × AI',
  tradeTitle: 'Principal Product Architect',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  location: 'Tokyo // Remote',
  availability: 'DEEP_WORK_ONLY',
  socialLinks: {
    github: 'https://github.com/vedanshu',
    linkedin: 'https://linkedin.com/in/vedanshu',
    substack: 'https://vedanshu.substack.com'
  },
  corePhilosophy: 'Logic is the only scalable aesthetic. UI is a byproduct of sound decision architecture.'
};

export const DEFAULT_VECTOR: DirectionalVector = {
  focus: 'System Logic',
  activeDomains: ['Systems', 'Ops', 'Tech'],
  suppressedDomains: ['Surface UX', 'Decorative Design'],
  evaluationBias: 'Correctness > Speed',
};

export const MOCK_CAPABILITIES = [
  { label: 'UX', depth: 0.9, status: 'MASTERED' },
  { label: 'Product', depth: 0.85, status: 'ACTIVE' },
  { label: 'Systems', depth: 0.95, status: 'CORE' },
  { label: 'Ops', depth: 0.7, status: 'GROWING' },
  { label: 'Tech', depth: 0.6, status: 'AWARE' },
];

export const MOCK_PULSE: PulseItem[] = [
  { id: 'p1', platform: 'Substack', content: 'Metabolizing Complexity: Why Rework is a Decision Failure', timestamp: '2h ago', complexity: 'high', status: 'pulse' },
  { id: 'p2', platform: 'GitHub', content: 'Refactored pgvector indexing for semantic search optimization', timestamp: '5h ago', complexity: 'high', status: 'pulse' },
  { id: 'p3', platform: 'Voice', content: 'Strategic Spark: The intersection of F&B logistics and Fintech trust', timestamp: '1d ago', complexity: 'low', status: 'pulse' },
  { id: 'p4', platform: 'Figma', content: 'Finalized logic tokens for Identity Prism Design System', timestamp: '2d ago', complexity: 'high', status: 'pulse' },
  { id: 'p5', platform: 'Substack', content: 'The Generalist Penalty: How to index logic over titles', timestamp: '3d ago', complexity: 'high', status: 'pulse' },
];

export const MOCK_SIGNALS: Signal[] = [
  { id: 's1', label: 'Anti-Rework', content: 'Fix root structures so problems never return.', tags: ['Systems', 'Ops'], evidenceCount: 12, lastVerified: '2024.03.15', strength: 0.95 },
  { id: 's2', label: 'Centralization', content: 'Reduce entropy by unifying fragmented data flows.', tags: ['Architecture', 'Logic'], evidenceCount: 8, lastVerified: '2024.03.16', strength: 0.88 },
  { id: 's3', label: 'Logic > Surface', content: 'Most products fail at decision structure, not UI.', tags: ['Product', 'UX'], evidenceCount: 15, lastVerified: '2024.03.17', strength: 0.92 },
  { id: 's4', label: 'Cognitive Offloading', content: 'Designing systems that think so users don\'t have to.', tags: ['AI', 'Cognitive Science'], evidenceCount: 6, lastVerified: '2024.03.18', strength: 0.85 },
  { id: 's5', label: 'Systemic Empathy', content: 'Understanding the human cost of technical debt.', tags: ['Culture', 'Systems'], evidenceCount: 9, lastVerified: '2024.03.19', strength: 0.90 },
];

export const MOCK_MEDIA = [
  { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80', label: 'SYSTEM_ARCH' },
  { type: 'VIDEO', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-lines-of-light-22606-large.mp4', label: 'LOGIC_FLOW' },
  { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', label: 'REACT_CORE' },
  { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', label: 'CYBER_SECURITY' },
  { type: 'VIDEO', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-14052-large.mp4', label: 'NEURAL_NET' },
  { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', label: 'GLOBAL_SYNC' },
];

export const MOCK_PATTERNS: { name: string; description: string }[] = [
  { name: 'Bridging the Engineering-UX Gap', description: 'Solving the gap between engineering and user reality.' },
  { name: 'Anti-Rework Protocol', description: 'Fixing root structures so problems never return.' },
  { name: 'Culturally Adaptive UX', description: 'Moving beyond translation into localization.' },
];

export const MOCK_PROOFS: SystemProof[] = [
  {
    id: 'sys_kotak',
    title: 'Kotak Rewards',
    problem: 'Low user retention in loyalty programs.',
    logic: 'Gamified loyalty UX via Figma AI/Bolt.',
    outcome: '12% retention delta.',
    industry: 'Fintech',
    tags: ['Loyalty', 'Retention', 'UX'],
    story: 'How we used gamification to drive trust in a legacy banking environment.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    timestamp: '2024.01',
    link: 'https://example.com/case-study'
  },
  {
    id: 'sys_adneto',
    title: 'Adneto',
    problem: 'Slow iteration cycles and manual PRD generation.',
    logic: 'Automation of PRDs and design tokens.',
    outcome: '30% reduction in iteration time.',
    industry: 'Adtech',
    tags: ['Automation', 'Ops', 'PRD'],
    story: 'Automating the bridge between product vision and engineering execution.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    timestamp: '2023.11',
    link: 'https://example.com/case-study'
  },
  {
    id: 'sys_manyavar',
    title: 'Manyavar',
    problem: 'Retail turnaround requiring systemic design over visual polish.',
    logic: 'System design over visual polish.',
    outcome: 'Turning around a turnaround.',
    industry: 'Retail',
    tags: ['Turnaround', 'Systems', 'Commerce'],
    story: 'Fixing the operational logic of a multi-channel retail giant.',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    timestamp: '2023.08',
    link: 'https://example.com/case-study'
  },
  {
    id: 'sys_cognitive',
    title: 'Cognitive Offloading Architecture',
    problem: 'Users overwhelmed by 50+ daily decisions in logistics management.',
    logic: 'Implemented a predictive "Decision Queue" that pre-calculates 90% of routine choices.',
    outcome: '60% reduction in decision latency; 15% increase in operational throughput.',
    industry: 'Logistics',
    tags: ['AI', 'UX', 'Systems'],
    timestamp: '2024.02.10',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    story: 'We realized the bottleneck wasn\'t the trucks, it was the dispatchers\' brains. We built a proxy for their intuition.'
  },
  {
    id: 'sys_antifragile',
    title: 'Anti-Fragile Fintech Core',
    problem: 'Legacy banking systems failing during high-volatility market events.',
    logic: 'Redesigned the ledger using a distributed, immutable event-stream with self-healing nodes.',
    outcome: 'Zero downtime during the 2023 market surge; 100% data integrity.',
    industry: 'Fintech',
    tags: ['Backend', 'Architecture', 'Security'],
    timestamp: '2023.11.05',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80',
    story: 'Banks are built on trust, but their tech is built on hope. We replaced hope with mathematical certainty.'
  }
];

export const MOCK_INSIGHTS: IntelligenceInsight[] = [
  {
    id: 'i1',
    statement: 'Rework is not an execution issue. It is a decision failure.',
    traceId: 't1',
    timestamp: '2024.03.15',
    evolution: {
      from: 'UI is the primary driver of user value.',
      resolution: 'Shifted focus to decision architecture after observing onboarding fatigue.'
    },
    link: 'https://substack.com/@vedanshu/p/decision-structure'
  },
  {
    id: 'i2',
    statement: 'Most teams optimize UI before fixing system structure.',
    traceId: 't2',
    timestamp: '2024.03.16',
    evolution: {
      from: 'Manual oversight ensures quality.',
      resolution: 'Automated deployment pipelines proved that constraints ensure quality better than humans.'
    },
    link: 'https://medium.com/@vedanshu/rework-is-decision-failure'
  },
  {
    id: 'i3',
    statement: 'Centralization is not control. It is clarity.',
    traceId: 't3',
    timestamp: '2024.03.17',
    link: 'https://substack.com/@vedanshu'
  }
];

export const MOCK_TRACES: Record<string, TraceLog> = {
  t1: { id: 't1', type: 'commit', content: 'Observed 30% drop-off in multi-step forms. Logic was sound, but decision checkpoints were buried.', timestamp: '2024.03.15' },
  t2: { id: 't2', type: 'voice', content: 'Discussion on why we are rebuilding the dashboard for the 3rd time. Root cause: unclear ownership of data fields.', timestamp: '2024.03.16' },
  t3: { id: 't3', type: 'figma', content: 'Mapping decision flows for autonomous product systems.', timestamp: '2024.03.17' }
};

export const MOCK_TEMPORAL: TemporalNode[] = [
  { id: '1', label: 'AI-native systems', status: 'active', timestamp: 'Current' },
  { id: '2', label: 'Structured decision environments', status: 'active', timestamp: 'Current' },
  { id: '3', label: 'UX systems', status: 'deprecated', timestamp: '2023' },
  { id: '4', label: 'Operational logic focus', status: 'signal', timestamp: 'Emerging' },
];

export const MOCK_EXPERIMENTS: Experiment[] = [
  { id: 'e1', title: 'AI-assisted workflow automation', tag: 'AI', tried: 'Using LLMs to map decision trees.', result: 'Reduced mapping time by 60%.' },
  { id: 'e2', title: 'Design-to-code pipelines', tag: 'OPS', tried: 'Automated token extraction from Figma.', result: 'Consistent UI across 4 platforms.' },
  { id: 'e3', title: 'Decision mapping frameworks', tag: 'SYSTEMS', tried: 'Standardizing decision nodes across industries.', result: 'Ongoing.' },
];

export const MOCK_AUDIO_INSIGHTS: AudioInsight[] = [
  {
    id: 'a1',
    title: 'The Generalist Penalty',
    duration: 28,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    timestamp: '2024.03.10',
    isGated: false,
    tags: ['Strategy', 'Career'],
    transcript: 'Being a generalist is a penalty in a world that indexes by titles. You have to index by logic instead.'
  },
  {
    id: 'a2',
    title: 'Rework as Decision Failure',
    duration: 30,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    timestamp: '2024.03.12',
    isGated: true,
    tags: ['Systems', 'Ops'],
    transcript: 'If you are rebuilding it for the third time, you didn\'t have a technical problem. You had a decision problem.'
  },
  {
    id: 'a3',
    title: 'Fintech Trust Logic',
    duration: 24,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    timestamp: '2024.03.14',
    isGated: false,
    tags: ['Fintech', 'Trust'],
    transcript: 'Trust in Fintech isn\'t about the UI. It\'s about the predictability of the system under stress.'
  }
];

export const MOCK_HOLD: string[] = [
  'Eleks - Distributed Ledger Frameworks: Corda vs Hyperledger (6001 words, 1 CTA sticky right).',
  'Pratip Biswas (Unified Infotech) - Posts motivational quotes, comic strip artwork.',
  'Tanmay to audit GMB & Edit. Shreya to send extensive questionnaire.',
  'Subscription for SEMRush.',
  'Netguru uses progressive CTAs on 792-word Angular blogs.',
];


// ============================================================================
// PHASE 2 SUPABASE MOCKS : VENTURE VAULT & IDENTITY PILLARS
// ============================================================================

export const MOCK_IDENTITY_PILLARS = [
  { id: '1', type: 'Origin', content: 'The 0→1 Mindset (Logic > Surface)', active: true },
  { id: '2', type: 'Stack', content: '11+ Industries Orchestrator', active: true },
  { id: '3', type: 'Philosophy', content: 'Systemic Unfucking over cosmetic patching.', active: true },
  { id: '4', type: 'Obsession', content: 'Agentic AI Workflows', active: true },
];

export const MOCK_VENTURES = [
  { id: 'v1', name: 'Fintech Core Pivot', phase: 'Scaling', role: 'Architect', logic_tags: ['Systems', 'Security', 'Finance'] },
  { id: 'v2', name: 'F&B Decentralization', phase: '0->1', role: 'Founder', logic_tags: ['Ops', 'Logistics', 'Incentives'] },
  { id: 'v3', name: 'Retail UX Overhaul', phase: 'Scaling', role: 'Delivery', logic_tags: ['Product', 'UX'] }
];

export const MOCK_EXPERIENCE_MATRIX = [
  {
    id: 'e1',
    venture_id: 'v1',
    title: 'Anti-Fragile Ledger Resilience',
    industry: ['Fintech'],
    legacy_lessons: 'Built this in 2023. Shows why rigid systems eventually break under velocity. The logic remains core for LLM orchestrations today.',
    logic_applied: 'Decentralized state verification',
    content_markdown: `# The Fintech Pivot
When the ledger failed...`
  },
  {
    id: 'e2',
    venture_id: 'v2',
    title: 'Crisis Response at Kitchen X',
    industry: ['F&B', 'Logistics'],
    legacy_lessons: 'We survived a 40% supply chain drop not by shouting louder, but by rewiring the incentive loop.',
    logic_applied: 'Temporary Circuit Breaker & Decentralized Incentives',
    content_markdown: `# The Death Spiral
Stopping orders to save the brand.`
  }
];


// ============================================================================
// PHASE 3: ADAPTIVE SOCIAL PROOF (REFERRAL WEB)
// ============================================================================

export const MOCK_TESTIMONIALS = [
  { id: 't1', persona: 'Architect', text: "Vedanshu rebuilt our decentralized routing logic overnight. He doesn't write code; he writes structural inevitabilities.", author: 'CTO, Fintech Corp' },
  { id: 't2', persona: 'Founder', text: 'The pivot mapped out cut our burn rate by 40%. Direct, ROI-focused operations without the agency fluff.', author: 'CEO, Kitchen X' },
  { id: 't3', persona: 'Coach', text: 'He has an empathetic grip on systemic anxiety. The session cleared my mental stack immediately.', author: 'Series A Founder' }
];
