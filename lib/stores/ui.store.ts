import { create } from "zustand";

type UiState = {
  globalLoading: boolean;
  globalLoadingText?: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  globalLoading: false,
  globalLoadingText: undefined,
  startLoading: (text) => set({ globalLoading: true, globalLoadingText: text }),
  stopLoading: () => set({ globalLoading: false, globalLoadingText: undefined }),
}));