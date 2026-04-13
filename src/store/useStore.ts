import { create } from 'zustand';

interface AppState {
  // MVS Mode: 'capital' (Capital Accumulation) | 'spirit' (Spirit Growth)
  mvsMode: 'capital' | 'spirit';
  setMvsMode: (mode: 'capital' | 'spirit') => void;
  
  // Intent: 'architect' | 'founder' | 'coach'
  intent: 'architect' | 'founder' | 'coach';
  setIntent: (intent: 'architect' | 'founder' | 'coach') => void;
  
  // Kanban State
  kanban: {
    hold: string[];
    signals: string[];
    live: string[];
  };
  moveCard: (id: string, from: keyof AppState['kanban'], to: keyof AppState['kanban']) => void;
  
  // Trace Modal
  traceModalOpen: boolean;
  activeTraceId: string | null;
  openTrace: (id: string) => void;
  closeTrace: () => void;

  // Mock Data Injection
  mockJd: string | null;
  setMockJd: (jd: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  mvsMode: 'spirit',
  setMvsMode: (mode) => set({ mvsMode: mode }),
  
  intent: 'architect',
  setIntent: (intent) => set({ intent }),
  
  kanban: {
    hold: ['Signal_01: Substack Insight', 'Signal_02: GitHub Pattern'],
    signals: ['Signal_03: Systemic Logic'],
    live: ['Signal_04: The Prism Manifesto'],
  },
  moveCard: (id, from, to) => set((state) => {
    const fromList = state.kanban[from].filter(item => item !== id);
    const toList = [...state.kanban[to], id];
    return {
      kanban: {
        ...state.kanban,
        [from]: fromList,
        [to]: toList,
      }
    };
  }),
  
  traceModalOpen: false,
  activeTraceId: null,
  openTrace: (id) => set({ traceModalOpen: true, activeTraceId: id }),
  closeTrace: () => set({ traceModalOpen: false, activeTraceId: null }),

  mockJd: null,
  setMockJd: (jd) => set({ mockJd: jd }),
}));
