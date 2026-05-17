/**
 * 后端 API 端点常量 — 与 api_design.md / 后端路由严格一致
 *
 * 所有 ID 参数统一为 string（后端使用字符串 ID）。
 */

const API_PREFIX = "/api/v1";

export const API = {
  // ── 认证 ──
  AUTH: {
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGIN: `${API_PREFIX}/auth/login`,
    SMS_SEND: `${API_PREFIX}/auth/sms/send`,
    SMS_LOGIN: `${API_PREFIX}/auth/sms/login`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    PASSWORD: `${API_PREFIX}/auth/password`,
    SESSIONS: `${API_PREFIX}/auth/sessions`,
    SESSION: (sessionId: string) => `${API_PREFIX}/auth/sessions/${sessionId}`,
  },

  // ── 用户 ──
  USERS: {
    /** GET/PUT/DELETE 自己的完整档案（L1） */
    ME: `${API_PREFIX}/users/me`,
    /** GET 他人公开主页（L0） */
    PROFILE: (userId: string) => `${API_PREFIX}/users/${userId}`,
    /** GET 该用户发表的帖子列表（L0） */
    USER_POSTS: (userId: string) => `${API_PREFIX}/users/${userId}/posts`,
    // 收藏
    FAVORITES: `${API_PREFIX}/users/me/favorites`,
    FAVORITE: (postId: string) => `${API_PREFIX}/users/me/favorites/${postId}`,
    // 订阅
    SUBSCRIPTIONS: `${API_PREFIX}/users/me/subscriptions`,
    SUBSCRIPTION: (userId: string) => `${API_PREFIX}/users/me/subscriptions/${userId}`,
    SUBSCRIPTION_POSTS: `${API_PREFIX}/users/me/subscriptions/posts`,
    // 打分历史（L2）
    SCORES: `${API_PREFIX}/users/me/scores`,
  },

  // ── 帖子 ──
  POSTS: {
    LIST: `${API_PREFIX}/posts`,
    CREATE: `${API_PREFIX}/posts`,
    DETAIL: (postId: string) => `${API_PREFIX}/posts/${postId}`,
    UPDATE: (postId: string) => `${API_PREFIX}/posts/${postId}`,
    DELETE: (postId: string) => `${API_PREFIX}/posts/${postId}`,
    // 认同度打分
    SCORES: (postId: string) => `${API_PREFIX}/posts/${postId}/scores`,
    // 评论
    COMMENTS: (postId: string) => `${API_PREFIX}/posts/${postId}/comments`,
    COMMENT: (postId: string, commentId: string) =>
      `${API_PREFIX}/posts/${postId}/comments/${commentId}`,
    COMMENT_REACTION: (postId: string, commentId: string) =>
      `${API_PREFIX}/posts/${postId}/comments/${commentId}/reaction`,
    // 分享
    SHARE: (postId: string) => `${API_PREFIX}/posts/${postId}/share`,
    // 删除申请
    DELETE_REQUEST: (postId: string) => `${API_PREFIX}/posts/${postId}/delete-request`,
    COMMENT_DELETE_REQUEST: (postId: string, commentId: string) =>
      `${API_PREFIX}/posts/${postId}/comments/${commentId}/delete-request`,
  },

  // ── 品类 ──
  CATEGORIES: `${API_PREFIX}/categories`,

  // ── 认证（实人认证） ──
  CERTIFICATIONS: {
    REAL_NAME: `${API_PREFIX}/certifications/real-name`,
    REAL_PERSON: `${API_PREFIX}/certifications/real-person`,
    SESSION_VERIFY: `${API_PREFIX}/certifications/session-verify`,
    TRUSTED: `${API_PREFIX}/certifications/trusted`,
    STATUS: `${API_PREFIX}/certifications/status`,
  },

  // ── 举报 ──
  REPORTS: `${API_PREFIX}/reports`,

  // ── 分享码 ──
  SHARE: {
    RESOLVE: (shareCode: string) => `${API_PREFIX}/s/${shareCode}`,
  },

  // ── 风控（用户端） ──
  RISK_CONTROL: {
    CHECK: `${API_PREFIX}/risk-control/check`,
    EVENTS: `${API_PREFIX}/risk-control/events`,
    BLACKLIST: `${API_PREFIX}/risk-control/blacklist`,
  },

  // ── 管理后台 ──
  ADMIN: {
    ME: `${API_PREFIX}/admin/me`,

    // 黑名单
    BLACKLIST: `${API_PREFIX}/admin/blacklist`,
    BLACKLIST_ENTRY: (blacklistId: string) =>
      `${API_PREFIX}/admin/blacklist/${blacklistId}`,

    // 用户管理
    USERS: `${API_PREFIX}/admin/users`,
    USER_DETAIL: (userId: string) => `${API_PREFIX}/admin/users/${userId}`,
    USER_STATUS: (userId: string) => `${API_PREFIX}/admin/users/${userId}/status`,
    USER_LEVEL: (userId: string) => `${API_PREFIX}/admin/users/${userId}/level`,
    USER_OPERATION_LOGS: (userId: string) =>
      `${API_PREFIX}/admin/users/${userId}/operation-logs`,
    USER_RISK_HISTORY: (userId: string) =>
      `${API_PREFIX}/admin/users/${userId}/risk-history`,

    // 帖子审核
    POSTS_PENDING: `${API_PREFIX}/admin/posts/pending`,
    POST_DETAIL: (postId: string) => `${API_PREFIX}/admin/posts/${postId}`,
    POST_REVIEW: (postId: string) => `${API_PREFIX}/admin/posts/${postId}/review`,
    POST_VISIBILITY: (postId: string) =>
      `${API_PREFIX}/admin/posts/${postId}/visibility`,

    // 评论审核
    COMMENTS_PENDING: `${API_PREFIX}/admin/comments/pending`,
    COMMENT_DETAIL: (commentId: string) =>
      `${API_PREFIX}/admin/comments/${commentId}`,
    COMMENT_REVIEW: (commentId: string) =>
      `${API_PREFIX}/admin/comments/${commentId}/review`,

    // 删除申请处理
    DELETION_REQUESTS: `${API_PREFIX}/admin/deletion-requests`,
    DELETION_REVIEW: (requestId: string) =>
      `${API_PREFIX}/admin/deletion-requests/${requestId}/review`,

    // 举报处理
    REPORTS: `${API_PREFIX}/admin/reports`,
    REPORT_RESOLVE: (reportId: string) =>
      `${API_PREFIX}/admin/reports/${reportId}/resolve`,

    // 认证审核
    CERTIFICATIONS_PENDING: `${API_PREFIX}/admin/certifications/pending`,
    CERTIFICATION_DETAIL: (certId: string) =>
      `${API_PREFIX}/admin/certifications/${certId}`,
    CERTIFICATION_REVIEW: (certId: string) =>
      `${API_PREFIX}/admin/certifications/${certId}/review`,

    // 风控
    RISK_EVENTS: `${API_PREFIX}/admin/risk/events`,
    RISK_EVENT: (eventId: string) => `${API_PREFIX}/admin/risk/events/${eventId}`,
    RISK_SUMMARY: `${API_PREFIX}/admin/risk/summary`,

    // 审核员管理
    REVIEWERS: `${API_PREFIX}/admin/reviewers`,
    REVIEWER_PERMISSIONS: (userId: string) =>
      `${API_PREFIX}/admin/reviewers/${userId}/permissions`,
    REVIEWER: (userId: string) => `${API_PREFIX}/admin/reviewers/${userId}`,

    // 仲裁（兼容旧版）
    ARBITRATION: `${API_PREFIX}/admin/arbitration`,
  },

  // ── 上传 ──
  UPLOAD: {
    IMAGE: `${API_PREFIX}/uploads/image`,
  },

  // ── AI 辅助 ──
  AI: {
    FORMAT: `${API_PREFIX}/ai/format`,
    COMPLIANCE_CHECK: `${API_PREFIX}/ai/compliance-check`,
  },

  // ── 健康检查 ──
  HEALTH: `${API_PREFIX}/health`,
} as const;
