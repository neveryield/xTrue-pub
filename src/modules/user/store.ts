/**
 * User 模块状态管理 — 当前登录用户信息缓存
 */

import { create } from "zustand";

interface UserProfileCache {
  userId: number;
  nickname: string | null;
  avatar: string | null;
  credibility: number;
  userLevel: number;
}

interface UserState {
  /** 当前查看的用户档案缓存 */
  profileCache: UserProfileCache | null;
  setProfileCache: (profile: UserProfileCache) => void;
  clearProfileCache: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profileCache: null,

  setProfileCache: (profile) => set({ profileCache: profile }),

  clearProfileCache: () => set({ profileCache: null }),
}));
