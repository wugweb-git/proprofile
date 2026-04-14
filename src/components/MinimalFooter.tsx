import React from 'react';

export const MinimalFooter = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white border-t border-white/5 py-8 px-8 md:px-16 flex items-center justify-between mt-auto z-[50]">
      <div className="font-display font-bold text-2xl tracking-tighter text-[#a8a8a8] select-none">
        VS
      </div>
      
      <div className="flex items-center gap-6 text-[#a8a8a8] font-sans text-sm">
        <a href="#" className="hover:text-white transition-colors underline decoration-[#a8a8a8]/40 underline-offset-4">Privacy</a>
        <a href="#" className="hover:text-white transition-colors underline decoration-[#a8a8a8]/40 underline-offset-4">& Terms</a>
      </div>
    </footer>
  );
};
