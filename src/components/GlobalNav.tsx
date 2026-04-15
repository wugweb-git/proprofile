import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, User, Zap, Menu, X, Image } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

export const GlobalNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: '/', label: 'Public Proxy', icon: <User size={18} /> },
    { path: '/owner', label: 'Owner Hub', icon: <Zap size={18} /> },
    { path: '/media', label: 'Media Vault', icon: <Image size={18} /> },
    { path: '/port', label: 'Complexity Port', icon: <Layers size={18} /> },
  ];

  return (
    <nav className="fixed bottom-[3vh] left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-[28rem]" aria-label="Global navigation" role="navigation">
      <div className="relative flex justify-center items-center gap-3">
        <ThemeToggle />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="global-nav-menu"
          aria-haspopup="true"
          aria-label="Toggle global navigation"
          className={cn(
            'h-[7vh] w-[14vw] min-h-12 min-w-12 max-h-14 max-w-14 rounded-full flex items-center justify-center border transition-colors',
            isOpen
              ? 'text-black [background:var(--accent)] [border-color:var(--accent)]'
              : 'text-primary surface-elevated border-primary'
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="global-nav-menu"
            role="menu"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="absolute bottom-[9vh] left-1/2 -translate-x-1/2 w-[92vw] max-w-[28rem] rounded-[1.5rem] p-[1.2rem] border border-primary surface-elevated"
          >
            <div className="space-y-2">
              {routes.map((route) => {
                const isActive =
                  location.pathname === route.path ||
                  (route.path !== '/' && location.pathname.startsWith(route.path));

                return (
                  <button
                    key={route.path}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      navigate(route.path);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                      isActive
                        ? 'border-[var(--accent)] [background:var(--accent-muted)] text-primary'
                        : 'border-transparent hover:[background:var(--state-hover)] text-secondary'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center border', isActive ? 'border-[var(--accent)] text-accent' : 'border-primary text-secondary')}>
                      {route.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-sm tracking-wide">{route.label}</span>
                      {isActive && <span className="nothing-dot-matrix text-accent">active</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
