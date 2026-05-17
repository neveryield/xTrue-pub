"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminBlacklist,
  getAdminArbitration,
  getAdminBlacklist,
  getAdminCertificationsPending,
  getAdminMe,
  getAdminPostsPending,
  getAdminRiskEvents,
  getAdminUsers,
  postAdminBlacklist,
  postAdminPostReview,
  postAdminUserLevel,
  putAdminUserStatus,
} from "./api";

const adminKey = ["admin"] as const;

export function useAdminMe() {
  return useQuery({
    queryKey: [...adminKey, "me"],
    queryFn: getAdminMe,
  });
}

export function useAdminBlacklist(offset: number, limit: number) {
  return useQuery({
    queryKey: [...adminKey, "blacklist", offset, limit],
    queryFn: () => getAdminBlacklist(offset, limit),
  });
}

export function useAdminAddBlacklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postAdminBlacklist,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "blacklist"] });
    },
  });
}

export function useAdminRemoveBlacklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteAdminBlacklist(String(id)),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "blacklist"] });
    },
  });
}

export function useAdminRiskEvents(offset: number, limit: number) {
  return useQuery({
    queryKey: [...adminKey, "risk-events", offset, limit],
    queryFn: () => getAdminRiskEvents(offset, limit),
  });
}

export function useAdminUsers(offset: number, limit: number, q: string) {
  return useQuery({
    queryKey: [...adminKey, "users", offset, limit, q],
    queryFn: () => getAdminUsers(offset, limit, q || undefined),
  });
}

export function useAdminUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string | number; status: number }) =>
      putAdminUserStatus(String(userId), status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "users"] });
    },
  });
}

export function useAdminUserLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, user_level }: { userId: string | number; user_level: number }) =>
      postAdminUserLevel(String(userId), user_level),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "users"] });
    },
  });
}

// ── 帖子审核（原 reviews → posts） ──

export function useAdminPostsPending(
  offset: number,
  limit: number,
) {
  return useQuery({
    queryKey: [...adminKey, "posts-pending", offset, limit],
    queryFn: () => getAdminPostsPending(offset, limit),
  });
}

export function useAdminPostReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, decision, reason }: { postId: string; decision: string; reason?: string }) =>
      postAdminPostReview(postId, { decision, reason }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "posts-pending"] });
    },
  });
}

/** @deprecated 使用 useAdminPostsPending */
export function useAdminReviews(
  offset: number,
  limit: number,
  _filters: { product_id?: number; user_id?: number; status?: number },
) {
  return useAdminPostsPending(offset, limit);
}

/** @deprecated 使用 useAdminPostReview */
export function useAdminReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_params: unknown) => {
      throw new Error("useAdminReviewStatus 已弃用，请使用 useAdminPostReview");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...adminKey, "posts-pending"] });
    },
  });
}

export function useAdminCertificationsPending() {
  return useQuery({
    queryKey: [...adminKey, "certifications", "pending"],
    queryFn: getAdminCertificationsPending,
  });
}

export function useAdminArbitration() {
  return useQuery({
    queryKey: [...adminKey, "arbitration"],
    queryFn: getAdminArbitration,
  });
}
