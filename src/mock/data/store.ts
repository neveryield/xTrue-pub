/**
 * 内存数据库 — Mock 数据的唯一真相源。
 * 页面刷新后 re-seed，session 内写操作可见。
 */

export interface MockUser {
  user_id: string
  nickname: string
  phone_hash: string
  email_hash: string | null
  username_norm: string
  password_hash: string    // mock 下存明文，仅用于登录校验
  user_level: number
  avatar_url: string | null
  bio: string | null
  credibility_score: number
  is_staff: boolean
  created_at: string
}

export interface MockPost {
  post_id: string
  category: string
  subcategory: string
  author_id: string
  title: string | null
  content: string
  images: string[]
  visibility: "public" | "subscribers" | "private"
  moderation_status: number
  authenticity_ack: boolean
  created_at: string
  updated_at: string
}

export interface MockComment {
  comment_id: string
  post_id: string
  author_id: string
  content: string
  images: string[]
  quote_comment_id: string | null
  moderation_status: number
  agree_count: number
  disagree_count: number
  created_at: string
}

export interface MockScore {
  post_id: string
  user_id: string
  score: number
}

export interface MockCertification {
  cert_id: string
  user_id: string
  cert_type: "real_name" | "real_person" | "trusted"
  status: "pending" | "approved" | "rejected"
  real_name: string | null
  id_card: string | null
  created_at: string
}

export interface MockSession {
  session_id: string
  user_id: string
  last_seen_at: string
}

export interface MockReport {
  report_id: string
  reporter_id: string
  target_type: "post" | "comment"
  target_id: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  created_at: string
}

export interface MockRiskEvent {
  event_id: string
  user_id: string
  event_type: string
  detail: string
  created_at: string
}

export interface MockFavorite {
  user_id: string
  post_ids: string[]
}

export interface MockSubscription {
  subscriber_id: string
  target_user_id: string
}

// ── 内存集合 ──

export const store = {
  users: new Map<string, MockUser>(),
  posts: new Map<string, MockPost>(),
  comments: new Map<string, MockComment>(),
  scores: new Map<string, MockScore[]>(),
  certifications: new Map<string, MockCertification>(),
  sessions: new Map<string, MockSession[]>(),
  reports: new Map<string, MockReport>(),
  riskEvents: new Map<string, MockRiskEvent[]>(),
  favorites: new Map<string, Set<string>>(),
  subscriptions: new Map<string, Set<string>>(),
  /** refresh_token → user_id */
  refreshTokens: new Map<string, string>(),
  /** token 黑名单 */
  tokenBlacklist: new Set<string>(),
}

export function clearStore() {
  store.users.clear()
  store.posts.clear()
  store.comments.clear()
  store.scores.clear()
  store.certifications.clear()
  store.sessions.clear()
  store.reports.clear()
  store.riskEvents.clear()
  store.favorites.clear()
  store.subscriptions.clear()
  store.refreshTokens.clear()
  store.tokenBlacklist.clear()
}
