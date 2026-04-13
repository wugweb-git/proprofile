import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Save, Trash2, Tag, Briefcase, Globe, History, Settings } from 'lucide-react';
import { SystemProof } from '../types';
import { MOCK_PROOFS } from '../mockData';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const VentureVault = () => {
  const [proofs, setProofs] = useState<SystemProof[]>(MOCK_PROOFS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<SystemProof>>({
    title: '',
    problem: '',
    logic: '',
    outcome: '',
    industry: '',
    tags: [],
    story: '',
    imageUrl: '',
    link: '',
    timestamp: new Date().toISOString().split('T')[0]
  });

  const handleEdit = (proof: SystemProof) => {
    setEditingId(proof.id);
    setFormData(proof);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setProofs(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setProofs(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as SystemProof : p));
    } else {
      const newProof = {
        ...formData,
        id: `sys_${Date.now()}`,
      } as SystemProof;
      setProofs(prev => [newProof, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      problem: '',
      logic: '',
      outcome: '',
      industry: '',
      tags: [],
      story: '',
      imageUrl: '',
      link: '',
      timestamp: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <DotMatrixText>VENTURE_VAULT</DotMatrixText>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20"
        >
          <Plus size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 space-y-6"
          >
            <div className="flex justify-between items-center">
              <DotMatrixText color="text-red-600">{editingId ? 'EDITING_NODE' : 'NEW_VENTURE_NODE'}</DotMatrixText>
              <button onClick={resetForm} className="text-white/20 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-4">
              <input 
                placeholder="VENTURE_TITLE"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white font-display font-bold outline-none focus:border-red-600 transition-all"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    placeholder="INDUSTRY"
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pl-10 text-white text-xs font-mono outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div className="relative">
                  <History size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    placeholder="TIMESTAMP"
                    value={formData.timestamp}
                    onChange={e => setFormData({...formData, timestamp: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pl-10 text-white text-xs font-mono outline-none focus:border-red-600 transition-all"
                  />
                </div>
              </div>

              <textarea 
                placeholder="PROBLEM_STATEMENT"
                value={formData.problem}
                onChange={e => setFormData({...formData, problem: e.target.value})}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-red-600 transition-all h-24 resize-none"
              />

              <textarea 
                placeholder="LOGIC_APPLIED"
                value={formData.logic}
                onChange={e => setFormData({...formData, logic: e.target.value})}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-red-600 transition-all h-24 resize-none"
              />

              <textarea 
                placeholder="OUTCOME_METRIC"
                value={formData.outcome}
                onChange={e => setFormData({...formData, outcome: e.target.value})}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-red-600 transition-all h-24 resize-none"
              />

              <textarea 
                placeholder="THE_STORY (INSTA-STYLE)"
                value={formData.story}
                onChange={e => setFormData({...formData, story: e.target.value})}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-red-600 transition-all h-32 resize-none"
              />

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    placeholder="EXTERNAL_LINK (MEDIUM/SUBSTACK)"
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pl-10 text-white text-xs font-mono outline-none focus:border-red-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    placeholder="IMAGE_URL"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pl-10 text-white text-xs font-mono outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <button className="px-6 bg-white/5 rounded-2xl text-white/40 hover:bg-white/10 transition-all flex items-center gap-2">
                  <Globe size={14} /> <span className="text-[10px] font-mono">UPLOAD</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-5 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-xl shadow-red-600/20 hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              <Save size={16} /> Commit to Vault
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4"
          >
            {proofs.map(proof => (
              <div key={proof.id} className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex gap-6 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/5">
                  {proof.imageUrl ? (
                    <img src={proof.imageUrl} alt={proof.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={24}/></div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-display font-bold text-lg">{proof.title}</h4>
                      <DotMatrixText className="text-[8px]">{proof.industry}</DotMatrixText>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(proof)} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white"><Settings size={14}/></button>
                      <button onClick={() => handleDelete(proof.id)} className="p-2 rounded-full bg-white/5 text-red-600/40 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {proof.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-black/40 text-white/40 text-[8px] font-mono uppercase rounded-full border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
