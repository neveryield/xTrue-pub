/**
 * 用户模块 - API 调用封装
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type { UserProfile, FavoriteItem, SubscriptionUser, SubscriptionPostItem, ScoreHistoryItem, PaginatedList } from "./schemas";
import type { Post } from "../product/schemas";

/** 获取自己的完整档案（L1） */
export async function getMyProfile(): Promise<UserProfile> {
  return api.get<UserProfile>(API.USERS.ME, true);
}

/** 编辑昵称、头像（L1） */
export async function updateMyProfile(data: {
  nickname?: string;
  avatar_url?: string;
}): Promise<UserProfile> {
  return api.put<UserProfile>(API.USERS.ME, data, true);
}

/** 注销账号 — 软删除（L1） */
export async function deleteMyAccount(): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(API.USERS.ME, true);
}

/** 获取他人公开主页（L0） */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  return api.get<UserProfile>(API.USERS.PROFILE(userId), true);
}

/** 获取该用户发表的帖子列表（L0） */
export async function getUserPosts(
  userId: string,
  params?: { offset?: number; limit?: number },
): Promise<PaginatedList<Post>> {
  return api.get<PaginatedList<Post>>(API.USERS.USER_POSTS(userId), false, params as Record<string, string | number>);
}

// ── 收藏 ──

/** 收藏帖子（L1） */
export async function addFavorite(postId: string): Promise<{ ok: boolean }> {
  return api.post<{ ok: boolean }>(API.USERS.FAVORITE(postId), {}, true);
}

/** 取消收藏（L1） */
export async function removeFavorite(postId: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(API.USERS.FAVORITE(postId), true);
}

/** 收藏帖子列表（L1，分页） */
export async function listFavorites(offset = 0, limit = 20): Promise<PaginatedList<FavoriteItem>> {
  return api.get<PaginatedList<FavoriteItem>>(API.USERS.FAVORITES, true, { offset, limit });
}

// ── 订阅 ──

/** 订阅评价者（L1） */
export async function addSubscription(userId: string): Promise<{ ok: boolean }> {
  return api.post<{ ok: boolean }>(API.USERS.SUBSCRIPTION(userId), {}, true);
}

/** 取消订阅（L1） */
export async function removeSubscription(userId: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(API.USERS.SUBSCRIPTION(userId), true);
}

/** 订阅用户列表（L1，分页） */
export async function listSubscriptions(offset = 0, limit = 20): Promise<PaginatedList<SubscriptionUser>> {
  return api.get<PaginatedList<SubscriptionUser>>(API.USERS.SUBSCRIPTIONS, true, { offset, limit });
}

/** 订阅用户的最近帖子 — 时间线（L1，分页） */
export async function listSubscriptionPosts(offset = 0, limit = 20): Promise<PaginatedList<SubscriptionPostItem>> {
  return api.get<PaginatedList<SubscriptionPostItem>>(API.USERS.SUBSCRIPTION_POSTS, true, { offset, limit });
}

// ── 打分历史 ──

/** 查看自己的认同度打分历史（L2，分页） */
export async function listScoreHistory(offset = 0, limit = 20): Promise<PaginatedList<ScoreHistoryItem>> {
  return api.get<PaginatedList<ScoreHistoryItem>>(API.USERS.SCORES, true, { offset, limit });
}
