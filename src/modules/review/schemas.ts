/**
 * 评价模块 - TypeScript 类型定义
 *
 * 后端已将 reviews 拆分为 scores（认同度打分 0-100）和 comments（评论）。
 */

import { z } from "zod";

// ---------- 表单校验 ----------

export const submitScoreSchema = z.object({
  score: z.number().int().min(0).max(100),
});

export const submitCommentSchema = z.object({
  content: z.string().min(1).max(20000),
  images: z.array(z.string()).max(3).default([]),
});

export type SubmitScoreForm = z.infer<typeof submitScoreSchema>;
export type SubmitCommentForm = z.infer<typeof submitCommentSchema>;

// ---------- 类型 ----------

/** 认同度打分响应 */
export interface Score {
  post_id: string;
  user_id: string;
  score: number;
  score_avg: number | null;
  score_count: number;
}

/** 认同度统计 */
export interface ScoreStats {
  post_id: string;
  score_avg: number | null;
  score_count: number;
}

/** 评论 */
export interface Comment {
  comment_id: string;
  post_id: string;
  author_id: string;
  content: string;
  images: string[];
  quote_comment_id: string | null;
  moderation_status: number;
  time_label: string;
  agree_count: number;
  disagree_count: number;
  quoted_comment: Comment | null;
  created_at?: string;
}

/** 评论列表 */
export interface CommentList {
  items: Comment[];
  total: number;
  offset: number;
  limit: number;
}

/** @deprecated 旧评价类型，逐步迁移到 Score + Comment */
export interface Review {
  review_id: number;
  user_id: number;
  product_id: number;
  score: number;
  content: string | null;
  authenticity: number | null;
  weight: number | null;
  status: number;
  helpful_count: number;
  created_at: string;
}

/** @deprecated 旧聚合评分类型 */
export interface ProductScore {
  product_id: number;
  weighted_score: number | null;
  review_count: number;
  dist: Record<string, number>;
  last_calc_at: string | null;
}

/** @deprecated 旧评价列表类型 */
export interface ReviewList {
  items: Review[];
  total: number;
  offset: number;
  limit: number;
}
