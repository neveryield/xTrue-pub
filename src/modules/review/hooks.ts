/**
 * 评价模块 - React Query Hooks
 *
 * 后端已将 reviews 拆分为 scores 和 comments。
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reviewApi from "./api";

// ── 认同度打分 ──

export function useScoreStats(postId: string) {
  return useQuery({
    queryKey: ["scoreStats", postId],
    queryFn: () => reviewApi.getScoreStats(postId),
  });
}

export function useUpsertScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, score }: { postId: string; score: number }) =>
      reviewApi.upsertScore(postId, score),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scoreStats", variables.postId] });
    },
  });
}

// ── 评论 ──

export function useComments(
  postId: string,
  params?: { offset?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["comments", postId, params],
    queryFn: () => reviewApi.getComments(postId, params),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: { content: string; images?: string[]; quote_comment_id?: string };
    }) => reviewApi.createComment(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId, content }: { postId: string; commentId: string; content: string }) =>
      reviewApi.updateComment(postId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
}

// ── 评论态度（认同/反对） ──

export function useCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      type,
    }: {
      postId: string;
      commentId: string;
      type: "agree" | "disagree";
    }) => reviewApi.upsertCommentReaction(postId, commentId, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
}

export function useDeleteCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      reviewApi.deleteCommentReaction(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
}

// ── 分享 & 删除申请 ──

export function useCreatePostShare() {
  return useMutation({
    mutationFn: (postId: string) => reviewApi.createPostShare(postId),
  });
}

export function useRequestPostDeletion() {
  return useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason: string }) =>
      reviewApi.requestPostDeletion(postId, reason),
  });
}

export function useRequestCommentDeletion() {
  return useMutation({
    mutationFn: ({ postId, commentId, reason }: { postId: string; commentId: string; reason: string }) =>
      reviewApi.requestCommentDeletion(postId, commentId, reason),
  });
}

// ── 兼容旧版 hooks（逐步弃用） ──

/** @deprecated 使用 useScoreStats */
export function useProductScore(productId: string) {
  return useScoreStats(productId);
}

/** @deprecated 使用 useComments */
export function useProductReviews(
  productId: string,
  params?: { offset?: number; limit?: number },
) {
  return useComments(productId, params);
}

/** @deprecated 评价拆分为打分和评论，请使用 useUpsertScore + useCreateComment */
export function useSubmitReview() {
  return useMutation({
    mutationFn: (_data: unknown) => {
      throw new Error("submitReview 已弃用，请使用 upsertScore 或 createComment");
    },
  });
}

/** @deprecated 后端不再支持 helpful 计数 */
export function useMarkHelpful() {
  return useMutation({
    mutationFn: (_reviewId: unknown) => {
      throw new Error("markHelpful 已弃用，后端不再提供此端点");
    },
  });
}
