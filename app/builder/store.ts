import { create } from 'zustand';

export interface Component {
  id: string; // Add ID to component itself for easier tree manipulation
  type: string;
  content: string;
  initialProps?: Record<string, any>;
  x?: number;
  y?: number;
  children?: Component[]; // Support nested components
  parentId?: string | null; // To track parent in the tree
  layout?: 'section' | 'row' | 'column' | 'content'; // Distinguish layout components
}

interface BuilderState {
  layoutTree: Record<string, Component>;
  setLayoutTree: (layoutTree: Record<string, Component> | ((prev: Record<string, Component>) => Record<string, Component>)) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  layoutTree: {},
  setLayoutTree: (layoutTree) => {
    if (typeof layoutTree === 'function') {
      set((state) => ({ layoutTree: layoutTree(state.layoutTree) }));
    } else {
      set({ layoutTree });
    }
  },
}));
