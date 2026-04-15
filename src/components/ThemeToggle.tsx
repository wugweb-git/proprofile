import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="h-[6.4vw] w-[6.4vw] min-h-10 min-w-10 max-h-12 max-w-12 rounded-full border border-primary surface-elevated text-primary inline-flex items-center justify-center transition-colors hover:[background:var(--state-hover)]"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
