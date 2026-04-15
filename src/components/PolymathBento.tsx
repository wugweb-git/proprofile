import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Brain, Layers, Target, ChevronRight, Zap, Combine, AudioLines, ShieldCheck, BriefcaseBusiness } from 'lucide-react';
import { MOCK_IDENTITY_PILLARS, MOCK_VENTURES, MOCK_EXPERIENCE_MATRIX, MOCK_TESTIMONIALS } from '../mockData';

type Persona = 'Architect' | 'Founder' | 'Coach';

const spiritTags = ['Logic-First', 'Effort-Agnostic', 'Cross-Pollination', '0→1 Ownership', 'Systems Empathy', 'Verification-Led'];

const workFindingRubric = [
  { label: 'Complexity Fit', value: 9, note: 'Cross-industry systems architecture required' },
  { label: 'Spirit Alignment', value: 8, note: 'Ownership and autonomy are explicit' },
  { label: 'Industry Stack', value: 8, note: 'Touches 3+ nodes in one role' },
  { label: 'Future Pull', value: 9, note: 'Agentic AI + fintech trendline' },
  { label: 'Signal Probability', value: 7, note: 'High-intent recruiter + clear fit' },
];

const personaTone: Record<Persona, string> = {
  Architect: 'Logical, high-density, systemic framing with verification-first language.',
  Founder: 'Outcome-led, ROI-focused, high-velocity storytelling anchored in leverage.',
  Coach: 'Human-centric, empathetic, and psychologically safe while staying precise.',
};


const contentBlocks = [
  {
    title: 'Experience Matrix',
    detail: 'SQL-native, multi-tag case studies with legacy lessons and 2026 perspective snapshots.',
    state: 'mapped',
  },
  {
    title: 'Identity Pillars',
    detail: 'Origin, Stack, Philosophy, and Obsession blocks rendered as modular nodes.',
    state: 'mapped',
  },
  {
    title: 'Deep Linking',
    detail: 'Industry tile → static case study + live pulse + curated inspiration in one query path.',
    state: 'defined',
  },
  {
    title: 'Admin Ingestion',
    detail: 'Mobile dump flow for markdown/json notes into structured storage.',
    state: 'defined',
  },
];

const primitiveStateMatrix = [
  { primitive: 'Button', states: 'idle · hover · active · focus · disabled' },
  { primitive: 'Textarea', states: 'idle · focus · disabled · error-ready' },
  { primitive: 'Card', states: 'default · highlighted · expanded' },
  { primitive: 'Navigation Tab', states: 'default · active · keyboard focus' },
];

export const PolymathBento = () => {
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>('Architect');

  const getPillarIcon = (type: string) => {
    switch (type) {
      case 'Origin':
        return <Brain size={18} className="text-accent" />;
      case 'Stack':
        return <Layers size={18} className="text-accent" />;
      case 'Philosophy':
        return <Target size={18} className="text-accent" />;
      case 'Obsession':
        return <Zap size={18} className="text-accent" />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-[90rem] mx-auto py-[8vh] px-[4vw] overflow-hidden" aria-label="Identity prism system core">
      <div className="mb-[4vh] flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-primary pb-6">
        <div>
          <h2 className="text-[var(--font-2xl)] font-bold tracking-tight mb-3 text-primary">The System Core</h2>
          <p className="text-secondary text-sm tracking-wide">Adaptive narrative blocks · readable, accessible, and role-aware.</p>
        </div>

        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
          <span className="nothing-dot-matrix text-secondary mb-2 flex items-center gap-2">
            <Combine size={12} className="text-accent" /> Persona tone rules
          </span>
          <div className="flex [background:var(--bg-tertiary)] p-1 rounded-full border border-primary" role="tablist" aria-label="Persona selector">
            {(['Architect', 'Founder', 'Coach'] as Persona[]).map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={persona === p}
                onClick={() => setPersona(p)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                  persona === p ? 'text-black [background:var(--accent)]' : 'text-secondary hover:text-primary'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-sm text-secondary mt-3 max-w-[36rem]">{personaTone[persona]}</p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={persona}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="mb-8 border border-primary p-5 rounded-2xl [background:var(--bg-secondary)]"
          role="article"
        >
          <span className="nothing-dot-matrix text-accent mb-2 block">Referral sync · verified {persona.toLowerCase()} signal</span>
          <p className="text-lg font-semibold text-primary">“{MOCK_TESTIMONIALS.find((t) => t.persona === persona)?.text}”</p>
          <p className="text-sm mt-2 text-secondary">— {MOCK_TESTIMONIALS.find((t) => t.persona === persona)?.author}</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-8" role="list" aria-label="Strategic cards">
        <article className="xl:col-span-4 nothing-card" role="listitem">
          <div className="flex items-center gap-2 mb-3"><Brain size={16} className="text-accent" /><h3 className="font-semibold">Logic-First Taxonomy</h3></div>
          <p className="text-sm text-secondary mb-4">Reduced duplicate labels into one spirit-tag system used by the agent and UI filters.</p>
          <div className="flex flex-wrap gap-2">
            {spiritTags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs border border-primary text-secondary">{tag}</span>
            ))}
          </div>
        </article>

        <article className="xl:col-span-4 nothing-card" role="listitem">
          <div className="flex items-center gap-2 mb-3"><BriefcaseBusiness size={16} className="text-accent" /><h3 className="font-semibold">Work-Finding Heuristic</h3></div>
          <ul className="space-y-2" role="list" aria-label="Job lead weighting rubric">
            {workFindingRubric.map((item) => (
              <li key={item.label} className="text-sm text-secondary flex justify-between gap-3">
                <span>{item.label}</span><span className="text-accent font-semibold">{item.value}/10</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-tertiary mt-3">Minimum Viable Spirit threshold: 7.5 / 10 before outreach.</p>
        </article>

        <article className="xl:col-span-4 nothing-card" role="listitem">
          <div className="flex items-center gap-2 mb-3"><AudioLines size={16} className="text-accent" /><h3 className="font-semibold">Voice of Experience</h3></div>
          <p className="text-sm text-secondary">Capture 30-second “Strategic Sparks” as private voice pulses by default, then promote selected clips publicly after review.</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-secondary"><ShieldCheck size={14} className="text-accent" /> Includes proof-of-origin trace with raw note + timestamp.</div>
        </article>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <article className="nothing-card" role="article">
          <h3 className="font-semibold mb-3">Content Mapping Status</h3>
          <ul className="space-y-3" role="list" aria-label="Content mapping status">
            {contentBlocks.map((block) => (
              <li key={block.title} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">{block.title}</p>
                  <p className="text-xs text-secondary">{block.detail}</p>
                </div>
                <span className="nothing-dot-matrix text-accent">{block.state}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="nothing-card" role="article">
          <h3 className="font-semibold mb-3">Primitives & States</h3>
          <ul className="space-y-3" role="list" aria-label="Primitive state definitions">
            {primitiveStateMatrix.map((item) => (
              <li key={item.primitive} className="flex items-center justify-between gap-4 border border-primary rounded-lg px-3 py-2">
                <span className="text-sm text-primary">{item.primitive}</span>
                <span className="text-xs text-secondary text-right">{item.states}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_IDENTITY_PILLARS.map((pillar) => {
          const isExpanded = activeTile === pillar.id;

          return (
            <motion.article
              key={pillar.id}
              layout
              onClick={() => setActiveTile(isExpanded ? null : pillar.id)}
              className={cn(
                'border rounded-[1.5rem] p-6 cursor-pointer transition-all overflow-hidden relative',
                isExpanded
                  ? 'md:col-span-2 border-[var(--accent)] [background:var(--accent-muted)] text-primary'
                  : 'md:col-span-1 border-primary [background:var(--bg-secondary)] text-primary'
              )}
              role="article"
              aria-label={`${pillar.type} pillar`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {getPillarIcon(pillar.type)}
                  <span className="nothing-dot-matrix text-secondary">{pillar.type}</span>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                  <ChevronRight size={16} className="text-secondary" />
                </motion.div>
              </div>

              <motion.h3 layout className="text-[var(--font-lg)] font-semibold tracking-tight mb-3">{pillar.content}</motion.h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-5 mt-5 border-t border-primary"
                  >
                    {pillar.type === 'Stack' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MOCK_VENTURES.slice(0, 4).map((v) => (
                          <div key={v.id} className="p-4 rounded-xl [background:var(--bg-elevated)] border border-primary">
                            <p className="nothing-dot-matrix text-accent">{v.phase} · {v.role}</p>
                            <p className="font-medium mt-2">{v.name}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {pillar.type === 'Philosophy' && (
                      <div className="space-y-3">
                        {MOCK_EXPERIENCE_MATRIX.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="p-4 rounded-xl [background:var(--bg-elevated)] border border-primary">
                            <p className="nothing-dot-matrix text-secondary">{exp.industry.join(' · ')}</p>
                            <p className="font-medium mt-1">{exp.title}</p>
                            <p className="text-sm text-secondary mt-2">{exp.legacy_lessons}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
