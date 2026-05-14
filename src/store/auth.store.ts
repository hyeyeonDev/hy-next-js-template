"use client";

import { create } from "zustand";

interface AuthClientState {
  returnTo: string | null;
  lastLoginAt: string | null;
  setReturnTo: (value: string | null) => void;
  markLoggedIn: () => void;
  resetAuthClientState: () => void;
}

export const useAuthStore = create<AuthClientState>((set) => ({
  returnTo: null,
  lastLoginAt: null,
  setReturnTo: (returnTo) => set({ returnTo }),
  markLoggedIn: () => set({ lastLoginAt: new Date().toISOString(), returnTo: null }),
  resetAuthClientState: () => set({ returnTo: null, lastLoginAt: null }),
}));
