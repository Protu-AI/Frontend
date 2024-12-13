// Store configurations will be added here as needed
import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));