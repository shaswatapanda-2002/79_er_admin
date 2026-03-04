// lib/auth/auth.store.ts
import { create } from "zustand";
import { clearToken, getToken, setToken } from "./auth.session";

export type AdminUser = {
  id: string;
  fullName: string;
  email?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  admin: AdminUser | null;

  // ✅ tells UI we already checked localStorage once
  hydrated: boolean;

  // actions
  hydrate: () => void;
  setAuth: (payload: { token: string; admin: AdminUser }) => void;
  setAdmin: (admin: AdminUser | null) => void;
  clearAuth: () => void;

  // helpers
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  admin: null,
  hydrated: false,

  hydrate: () => {
    const token = getToken();
    set({ token, hydrated: true });
  },

  setAuth: ({ token, admin }) => {
    setToken(token);
    set({ token, admin, hydrated: true });
  },

  setAdmin: (admin) => {
    set({ admin });
  },

  clearAuth: () => {
    clearToken();
    set({ token: null, admin: null, hydrated: true });
  },

  isAuthed: () => {
    const s = get();
    return !!s.token;
  },
}));