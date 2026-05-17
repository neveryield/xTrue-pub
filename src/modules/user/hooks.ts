/**
 * 用户模块 - React Query Hooks
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "./api";

/** 获取自己的完整档案（L1） */
export function useMyProfile() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: userApi.getMyProfile,
  });
}

/** 编辑自己的昵称/头像 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nickname?: string; avatar_url?: string }) =>
      userApi.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

/** 注销账号 */
export function useDeleteMyAccount() {
  return useMutation({
    mutationFn: userApi.deleteMyAccount,
  });
}

/** 查看他人公开主页（L0） */
export function useUserProfile(userId: string | null) {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => userApi.getUserProfile(userId!),
    enabled: !!userId,
  });
}

/** @deprecated 使用 useUpdateMyProfile */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_params: unknown) => {
      throw new Error("useUpdateProfile 已弃用，请使用 useUpdateMyProfile");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

// ── 收藏 ──

export function useFavorites(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ["user", "favorites", offset, limit],
    queryFn: () => userApi.listFavorites(offset, limit),
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => userApi.addFavorite(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => userApi.removeFavorite(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
    },
  });
}

// ── 订阅 ──

export function useSubscriptions(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ["user", "subscriptions", offset, limit],
    queryFn: () => userApi.listSubscriptions(offset, limit),
  });
}

export function useSubscriptionPosts(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ["user", "subscriptionPosts", offset, limit],
    queryFn: () => userApi.listSubscriptionPosts(offset, limit),
  });
}

export function useAddSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userApi.addSubscription(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "subscriptions"] });
    },
  });
}

export function useRemoveSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userApi.removeSubscription(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "subscriptions"] });
    },
  });
}

// ── 用户帖子 ──

export function useUserPosts(userId: string | null | undefined, params?: { offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ["user", "posts", userId, params],
    queryFn: () => userApi.getUserPosts(userId!, params),
    enabled: !!userId,
  });
}

// ── 打分历史 ──

export function useScoreHistory(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ["user", "scores", offset, limit],
    queryFn: () => userApi.listScoreHistory(offset, limit),
  });
}
