import { create } from 'zustand';

interface Component {
  type: string;
  content: string;
}

interface BuilderState {
  layoutTree: Record<string, Component>;
  setLayoutTree: (layoutTree: Record<string, Component>) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  layoutTree: {},
  setLayoutTree: (layoutTree) => set({ layoutTree }),
}));
