/**
 * 认证状态管理 — Zustand（Token 已迁移至 httpOnly Cookie）
 */

import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface AuthUser {
  userId: number;
  nickname: string | null;
  userLevel: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** 用户层级（0-5），未登录为 0 */
  userLevel: number;
  /** 有效层级（考虑当次验证后的实际可操作层级） */
  effectiveLevel: number;
  login: (user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  setEffectiveLevel: (level: number) => void;
  /** 通过 /users/me 恢复登录状态 */
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  userLevel: 0,
  effectiveLevel: 0,

  login: (user) => {
    set({
      user,
      isAuthenticated: true,
      userLevel: user.userLevel,
      effectiveLevel: user.userLevel,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      userLevel: 0,
      effectiveLevel: 0,
    });
  },

  setUser: (user) => set({ user, userLevel: user.userLevel }),

  setEffectiveLevel: (level) => set({ effectiveLevel: level }),

  restore: async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/me`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      const userLevel = (data.user_level as number) ?? 1;
      set({
        user: {
          userId: parseInt(String(data.user_id), 10),
          nickname: (data.nickname as string) ?? null,
          userLevel,
        },
        isAuthenticated: true,
        userLevel,
        effectiveLevel: userLevel,
      });
    } catch {
      // Not logged in or network error — stay as guest
    }
  },
}));
