/**
 * 用户模块 - TypeScript 类型定义
 */

export interface UserProfile {
  user_id: number;
  nickname: string | null;
  avatar_url: string | null;
  credibility: number;
  user_level: number;
  status: number;
  registered_at: string;
  created_at: string;
}

/** 收藏的帖子（API 返回） */
export interface FavoriteItem {
  post_id: string;
  category: string;
  subcategory: string;
  title: string | null;
  content?: string;
  content_preview?: string;
  score_avg: number | null;
  score_count: number;
  created_at?: string;
}

/** 订阅的用户 */
export interface SubscriptionUser {
  subscribed_user_id: string;
  user_id?: string;
  id?: string;
  nickname?: string | null;
  user_level?: number;
}

/** 订阅动态帖子 */
export interface SubscriptionPostItem {
  post_id: string;
  title?: string | null;
  post_title?: string;
  content?: string;
  score_count?: number;
  created_at?: string;
}

/** 打分历史条目 */
export interface ScoreHistoryItem {
  post_id: string;
  post_title?: string;
  score: number;
  created_at?: string;
  id?: string;
}

/** 通用分页列表 */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}
