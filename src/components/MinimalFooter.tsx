import React from 'react';

export const MinimalFooter = () => {
  return (
    <footer
      className="w-[100vw] border-t border-primary py-[2.2vh] px-[4vw] md:px-[6vw] mt-auto z-[50] surface-subtle"
      role="contentinfo"
    >
      <div className="w-full max-w-[92vw] mx-auto flex items-center justify-between gap-4">
        <div className="font-semibold text-[var(--font-lg)] tracking-tight text-secondary select-none">
          VS
        </div>

        <div className="flex items-center gap-[3vw] text-secondary text-sm">
          <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">
            Privacy
          </a>
          <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
