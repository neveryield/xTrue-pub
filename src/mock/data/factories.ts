/**
 * 工厂函数 — 生成 mock 实体，所有字段可覆盖。
 */

import type { MockUser, MockPost, MockComment, MockScore, MockCertification, MockSession, MockReport, MockRiskEvent } from "./store"

let _uid = 1
function uid(prefix = ""): string {
  return `${prefix}${String(_uid++).padStart(4, "0")}`
}

let _pid = 1
function pid(): string {
  return `p_${String(_pid++).padStart(6, "0")}`
}

let _cid = 1
function cid(): string {
  return `c_${String(_cid++).padStart(8, "0")}`
}

function randomDate(daysBack = 90): string {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  return d.toISOString()
}

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  const id = overrides.user_id ?? uid()
  const phone = `199${String(10000000 + parseInt(id)).slice(0, 8)}`
  return {
    user_id: id,
    nickname: overrides.nickname ?? `用户_${id}`,
    phone_hash: overrides.phone_hash ?? `hash_phone_${phone}`,
    email_hash: overrides.email_hash ?? null,
    username_norm: overrides.username_norm ?? `user_${id}`,
    password_hash: overrides.password_hash ?? "Test1234!",
    user_level: overrides.user_level ?? 1,
    avatar_url: overrides.avatar_url ?? null,
    bio: overrides.bio ?? null,
    credibility_score: overrides.credibility_score ?? 70,
    is_staff: overrides.is_staff ?? false,
    created_at: overrides.created_at ?? randomDate(365),
  }
}

export function createMockPost(overrides: Partial<MockPost> = {}): MockPost {
  const now = randomDate(60)
  return {
    post_id: overrides.post_id ?? pid(),
    category: overrides.category ?? "other",
    subcategory: overrides.subcategory ?? "",
    author_id: overrides.author_id ?? "",
    title: overrides.title ?? null,
    content: overrides.content ?? "<p>默认内容</p>",
    images: overrides.images ?? [],
    visibility: overrides.visibility ?? "public",
    moderation_status: overrides.moderation_status ?? 2,
    authenticity_ack: overrides.authenticity_ack ?? true,
    created_at: overrides.created_at ?? now,
    updated_at: overrides.updated_at ?? now,
  }
}

export function createMockComment(overrides: Partial<MockComment> = {}): MockComment {
  return {
    comment_id: overrides.comment_id ?? cid(),
    post_id: overrides.post_id ?? "",
    author_id: overrides.author_id ?? "",
    content: overrides.content ?? "默认评论",
    images: overrides.images ?? [],
    quote_comment_id: overrides.quote_comment_id ?? null,
    moderation_status: overrides.moderation_status ?? 2,
    agree_count: overrides.agree_count ?? 0,
    disagree_count: overrides.disagree_count ?? 0,
    created_at: overrides.created_at ?? randomDate(30),
  }
}

export function createMockScore(postId: string, userId: string, score?: number): MockScore {
  return {
    post_id: postId,
    user_id: userId,
    score: score ?? Math.floor(Math.random() * 51) + 50,
  }
}

export function createMockCertification(overrides: Partial<MockCertification> = {}): MockCertification {
  return {
    cert_id: overrides.cert_id ?? uid("cert_"),
    user_id: overrides.user_id ?? "",
    cert_type: overrides.cert_type ?? "real_name",
    status: overrides.status ?? "approved",
    real_name: overrides.real_name ?? null,
    id_card: overrides.id_card ?? null,
    created_at: overrides.created_at ?? randomDate(180),
  }
}

export function createMockSession(overrides: Partial<MockSession> = {}): MockSession {
  return {
    session_id: overrides.session_id ?? uid("sess_"),
    user_id: overrides.user_id ?? "",
    last_seen_at: overrides.last_seen_at ?? new Date().toISOString(),
  }
}

export function createMockReport(overrides: Partial<MockReport> = {}): MockReport {
  return {
    report_id: overrides.report_id ?? uid("rpt_"),
    reporter_id: overrides.reporter_id ?? "",
    target_type: overrides.target_type ?? "post",
    target_id: overrides.target_id ?? "",
    reason: overrides.reason ?? "",
    status: overrides.status ?? "pending",
    created_at: overrides.created_at ?? randomDate(30),
  }
}

export function createMockRiskEvent(overrides: Partial<MockRiskEvent> = {}): MockRiskEvent {
  return {
    event_id: overrides.event_id ?? uid("risk_"),
    user_id: overrides.user_id ?? "",
    event_type: overrides.event_type ?? "suspicious_login",
    detail: overrides.detail ?? "异地登录检测",
    created_at: overrides.created_at ?? randomDate(14),
  }
}
