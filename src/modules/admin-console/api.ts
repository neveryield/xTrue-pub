/**
 * 管理后台 API（Bearer 与主站共用 access_token）
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type {
  AdminBlacklistItem,
  AdminMe,
  AdminReviewRow,
  AdminRiskEventItem,
  AdminUserRow,
  ArbitrationPlaceholder,
  CertificationQueueResponse,
  PaginatedBlacklist,
  PaginatedReviews,
  PaginatedRiskEvents,
  PaginatedUsers,
} from "./schemas";

// ── 管理员身份 ──

export async function getAdminMe(): Promise<AdminMe> {
  return api.get<AdminMe>(API.ADMIN.ME, true);
}

// ── 黑名单 ──

export async function getAdminBlacklist(offset = 0, limit = 20): Promise<PaginatedBlacklist> {
  return api.get<PaginatedBlacklist>(API.ADMIN.BLACKLIST, true, { offset, limit });
}

export type BlacklistCreateResult = {
  blacklist_id: number;
  target_type: string;
  target_value: string;
  reason: string | null;
  expired_at: string | null;
  status: number;
};

export async function postAdminBlacklist(body: {
  target_type: string;
  target_value: string;
  reason?: string | null;
}): Promise<BlacklistCreateResult> {
  return api.post<BlacklistCreateResult>(API.ADMIN.BLACKLIST, body, true);
}

export async function putAdminBlacklist(
  blacklistId: string,
  body: { target_type?: string; target_value?: string; reason?: string | null },
): Promise<AdminBlacklistItem> {
  return api.put<AdminBlacklistItem>(API.ADMIN.BLACKLIST_ENTRY(blacklistId), body, true);
}

export async function deleteAdminBlacklist(blacklistId: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(API.ADMIN.BLACKLIST_ENTRY(blacklistId), true);
}

// ── 风控 ──

export async function getAdminRiskEvents(offset = 0, limit = 20): Promise<PaginatedRiskEvents> {
  return api.get<PaginatedRiskEvents>(API.ADMIN.RISK_EVENTS, true, { offset, limit });
}

export async function getAdminRiskEvent(eventId: string): Promise<AdminRiskEventItem> {
  return api.get<AdminRiskEventItem>(API.ADMIN.RISK_EVENT(eventId), true);
}

export async function getAdminRiskSummary(): Promise<{
  total_events: number;
  by_type: Record<string, number>;
}> {
  return api.get(API.ADMIN.RISK_SUMMARY, true);
}

// ── 用户管理 ──

export async function getAdminUsers(
  offset = 0,
  limit = 20,
  q?: string,
): Promise<PaginatedUsers> {
  return api.get<PaginatedUsers>(API.ADMIN.USERS, true, {
    offset,
    limit,
    ...(q ? { q } : {}),
  });
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserRow> {
  return api.get<AdminUserRow>(API.ADMIN.USER_DETAIL(userId), true);
}

export async function putAdminUserStatus(
  userId: string,
  status: number,
): Promise<{ user_id: string; status: number }> {
  return api.put(API.ADMIN.USER_STATUS(userId), { status }, true);
}

export async function postAdminUserLevel(
  userId: string,
  user_level: number,
): Promise<{ user_id: string; old_level: number; new_level: number }> {
  return api.post(API.ADMIN.USER_LEVEL(userId), { user_level }, true);
}

export async function getAdminUserOperationLogs(
  userId: string,
  offset = 0,
  limit = 20,
) {
  return api.get(API.ADMIN.USER_OPERATION_LOGS(userId), true, { offset, limit });
}

export async function getAdminUserRiskHistory(
  userId: string,
  offset = 0,
  limit = 20,
) {
  return api.get(API.ADMIN.USER_RISK_HISTORY(userId), true, { offset, limit });
}

// ── 帖子审核 ──

export async function getAdminPostsPending(offset = 0, limit = 20): Promise<PaginatedReviews> {
  return api.get<PaginatedReviews>(API.ADMIN.POSTS_PENDING, true, { offset, limit });
}

export async function getAdminPostDetail(postId: string): Promise<AdminReviewRow> {
  return api.get<AdminReviewRow>(API.ADMIN.POST_DETAIL(postId), true);
}

export async function postAdminPostReview(
  postId: string,
  body: { decision: string; reason?: string },
): Promise<{ post_id: string; moderation_status: number }> {
  return api.post(API.ADMIN.POST_REVIEW(postId), body, true);
}

export async function putAdminPostVisibility(
  postId: string,
  visibility: string,
): Promise<{ post_id: string; visibility: string }> {
  return api.put(API.ADMIN.POST_VISIBILITY(postId), { visibility }, true);
}

// ── 评论审核 ──

export async function getAdminCommentsPending(offset = 0, limit = 20) {
  return api.get(API.ADMIN.COMMENTS_PENDING, true, { offset, limit });
}

export async function getAdminCommentDetail(commentId: string) {
  return api.get(API.ADMIN.COMMENT_DETAIL(commentId), true);
}

export async function postAdminCommentReview(
  commentId: string,
  body: { decision: string; reason?: string },
) {
  return api.post(API.ADMIN.COMMENT_REVIEW(commentId), body, true);
}

// ── 删除申请处理 ──

export async function getAdminDeletionRequests(offset = 0, limit = 20) {
  return api.get(API.ADMIN.DELETION_REQUESTS, true, { offset, limit });
}

export async function postAdminDeletionReview(
  requestId: string,
  body: { decision: string; reason?: string },
) {
  return api.post(API.ADMIN.DELETION_REVIEW(requestId), body, true);
}

// ── 举报处理 ──

export async function getAdminReports(offset = 0, limit = 20) {
  return api.get(API.ADMIN.REPORTS, true, { offset, limit });
}

export async function postAdminReportResolve(
  reportId: string,
  body: { decision: string; reason?: string },
) {
  return api.post(API.ADMIN.REPORT_RESOLVE(reportId), body, true);
}

// ── 认证审核 ──

export async function getAdminCertificationsPending(): Promise<CertificationQueueResponse> {
  return api.get<CertificationQueueResponse>(API.ADMIN.CERTIFICATIONS_PENDING, true);
}

export async function getAdminCertificationDetail(certId: string) {
  return api.get(API.ADMIN.CERTIFICATION_DETAIL(certId), true);
}

export async function postAdminCertificationReview(
  certId: string,
  body: { decision: string; reason?: string },
) {
  return api.post(API.ADMIN.CERTIFICATION_REVIEW(certId), body, true);
}

// ── 审核员管理 ──

export async function getAdminReviewers() {
  return api.get(API.ADMIN.REVIEWERS, true);
}

export async function postAdminReviewer(body: {
  user_id: string;
  permissions: string[];
}) {
  return api.post(API.ADMIN.REVIEWERS, body, true);
}

export async function putAdminReviewerPermissions(
  userId: string,
  permissions: string[],
) {
  return api.put(API.ADMIN.REVIEWER_PERMISSIONS(userId), { permissions }, true);
}

export async function deleteAdminReviewer(userId: string) {
  return api.delete(API.ADMIN.REVIEWER(userId), true);
}

// ── 仲裁（兼容旧版） ──

export async function getAdminArbitration(): Promise<ArbitrationPlaceholder> {
  return api.get<ArbitrationPlaceholder>(API.ADMIN.ARBITRATION, true);
}
