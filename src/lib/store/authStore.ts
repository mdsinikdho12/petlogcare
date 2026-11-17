import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "USER" | "PROVIDER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  profileImage?: { url: string; key: string };
  verified?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

function syncCookies(token: string | null, role?: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `refreshToken=true; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `petcarelog_session=true; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (role) {
      document.cookie = `userRole=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } else {
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "petcarelog_session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "userRole=; path=/; max-age=0; SameSite=Lax";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        syncCookies(accessToken, user?.role);
        set({ user, accessToken, isAuthenticated: true });
      },
      setAccessToken: (token) => {
        set((state) => {
          syncCookies(token, state.user?.role);
          return { ...state, accessToken: token };
        });
      },
      clearAuth: () => {
        syncCookies(null, null);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "petcarelog-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          syncCookies(state.accessToken, state.user?.role);
        }
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
