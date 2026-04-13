import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, User, Zap, Menu, X, Image } from 'lucide-react';
import { cn } from '../lib/utils';

export const GlobalNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: '/', label: 'PUBLIC_PROXY', icon: <User size={18} />, color: 'bg-red-600' },
    { path: '/owner', label: 'OWNER_HUD', icon: <Zap size={18} />, color: 'bg-black' },
    { path: '/media', label: 'MEDIA_VAULT', icon: <Image size={18} />, color: 'bg-white text-black' },
    { path: '/port', label: 'COMPLEXITY_PORT', icon: <Layers size={18} />, color: 'bg-white text-black' },
  ];

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors",
            isOpen ? "bg-red-600 text-white" : "bg-black/90 text-white backdrop-blur-xl border border-white/10"
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] w-[320px] bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-2">
              {routes.map((route) => {
                const isActive = location.pathname === route.path || (route.path !== '/' && location.pathname.startsWith(route.path));
                return (
                  <button
                    key={route.path}
                    onClick={() => {
                      navigate(route.path);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group relative overflow-hidden",
                      isActive ? "bg-white/20 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"
                      />
                    )}
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", route.color)}>
                      {route.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "font-display font-bold text-xs tracking-widest uppercase",
                        isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
                      )}>
                        {route.label}
                      </span>
                      {isActive && (
                        <span className="text-[8px] font-mono text-red-600 uppercase mt-1">Active Environment</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
