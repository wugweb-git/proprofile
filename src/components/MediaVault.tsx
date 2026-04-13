import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Image as ImageIcon, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { MOCK_MEDIA } from '../mockData';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const MediaVault = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-white font-mono">
      <div className="max-w-[800px] mx-auto px-8 pt-32 pb-40">
        <div className="flex justify-between items-center mb-16">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div className="text-center">
            <DotMatrixText color="text-red-600">SYSTEM_ASSETS</DotMatrixText>
            <h1 className="text-4xl font-display font-bold tracking-tighter mt-2">Media Vault</h1>
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_MEDIA.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-square bg-white/5 rounded-[3rem] overflow-hidden border border-white/5 hover:border-red-600/30 transition-all"
            >
              {item.type === 'IMAGE' ? (
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                  alt={item.label} 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <video 
                  src={item.url} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'IMAGE' ? <ImageIcon size={12} className="text-red-600" /> : <Video size={12} className="text-red-600" />}
                    <DotMatrixText color="text-white/60" className="text-[10px]">{item.type}</DotMatrixText>
                  </div>
                  <div className="text-xl font-display font-bold tracking-tight">{item.label}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <DotMatrixText color="text-white/20">END_OF_VAULT</DotMatrixText>
        </div>
      </div>
    </div>
  );
};

export default MediaVault;
