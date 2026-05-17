/**
 * 评价模块 - API 调用封装
 *
 * 后端已将 reviews 拆分为 scores（认同度打分）和 comments（评论）。
 * 本模块文件名暂保留 review 兼容现有引用。
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type { Comment, CommentList, ScoreStats } from "./schemas";

// ── 认同度打分 ──

/** 提交/更新认同度打分（0-100） */
export async function upsertScore(
  postId: string,
  score: number,
): Promise<{ post_id: string; user_id: string; score: number; score_avg: number | null; score_count: number }> {
  return api.post(API.POSTS.SCORES(postId), { score }, true);
}

/** 获取帖子认同度统计 */
export async function getScoreStats(postId: string): Promise<ScoreStats> {
  return api.get<ScoreStats>(API.POSTS.SCORES(postId));
}

// ── 评论 ──

/** 发表评论 */
export async function createComment(
  postId: string,
  data: { content: string; images?: string[]; quote_comment_id?: string },
): Promise<Comment> {
  return api.post<Comment>(API.POSTS.COMMENTS(postId), data, true);
}

/** 获取帖子评论列表（分页） */
export async function getComments(
  postId: string,
  params?: { offset?: number; limit?: number },
): Promise<CommentList> {
  return api.get<CommentList>(
    API.POSTS.COMMENTS(postId),
    false,
    params as Record<string, string | number>,
  );
}

/** 编辑自己的评论（仅待审/退回状态可编辑） */
export async function updateComment(
  postId: string,
  commentId: string,
  content: string,
): Promise<Comment> {
  return api.put<Comment>(API.POSTS.COMMENT(postId, commentId), { content }, true);
}

/** 创建帖子分享码 */
export async function createPostShare(postId: string): Promise<{
  share_code: string;
  share_url: string;
}> {
  return api.post(API.POSTS.SHARE(postId), {}, true);
}

/** 申请删除帖子 */
export async function requestPostDeletion(
  postId: string,
  reason: string,
): Promise<{ request_id: string }> {
  return api.post(API.POSTS.DELETE_REQUEST(postId), { reason }, true);
}

/** 申请删除评论 */
export async function requestCommentDeletion(
  postId: string,
  commentId: string,
  reason: string,
): Promise<{ request_id: string }> {
  return api.post(API.POSTS.COMMENT_DELETE_REQUEST(postId, commentId), { reason }, true);
}

/** 对评论表达认同或反对 */
export async function upsertCommentReaction(
  postId: string,
  commentId: string,
  type: "agree" | "disagree",
): Promise<Comment> {
  return api.post<Comment>(API.POSTS.COMMENT_REACTION(postId, commentId), { type }, true);
}

/** 取消对评论的态度 */
export async function deleteCommentReaction(
  postId: string,
  commentId: string,
): Promise<Comment> {
  return api.delete<Comment>(API.POSTS.COMMENT_REACTION(postId, commentId), true);
}
