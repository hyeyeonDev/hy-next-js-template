"use client";

import { create } from "zustand";

interface UiState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  globalSearch: string;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (value: boolean) => void;
  setGlobalSearch: (value: string) => void;
  resetUi: () => void;
}

const initialUiState = {
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  globalSearch: "",
};

export const useUiStore = create<UiState>((set) => ({
  ...initialUiState,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setGlobalSearch: (globalSearch) => set({ globalSearch }),
  resetUi: () => set(initialUiState),
}));
