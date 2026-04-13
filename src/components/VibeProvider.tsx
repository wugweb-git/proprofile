import React, { createContext, useContext, useState } from 'react';
import { VibeMode, VibeState } from '../types';
import { DEFAULT_VECTOR } from '../mockData';

interface VibeContextType {
  state: VibeState;
  setMode: (mode: VibeMode) => void;
  setState: React.Dispatch<React.SetStateAction<VibeState>>;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export const VibeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VibeState>({
    mode: 'DEEP_LOGIC',
    location: 'Tokyo',
    music: 'Techno',
    focus: 'Deep Logic',
    vector: DEFAULT_VECTOR,
    personaFocus: {
      creativeEntrepreneur: 50,
      systemsArchitect: 80,
      productOperator: 60,
    },
    systemTheme: 'NOTHING_4.0',
  });

  const setMode = (mode: VibeMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  return (
    <VibeContext.Provider value={{ state, setMode, setState }}>
      {children}
    </VibeContext.Provider>
  );
};

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) throw new Error('useVibe must be used within VibeProvider');
  return context;
};
