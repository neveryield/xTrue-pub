/**
 * Mock 工具函数 — 解析请求参数、生成 ID 等。
 */

import { store } from "./data/store"

/** 解析 URL query string */
export function parseSearchParams(url: string): URLSearchParams {
  return new URL(url).searchParams
}

/** 从 query 中取分页参数 */
export function getPagination(url: string): { offset: number; limit: number } {
  const sp = parseSearchParams(url)
  return {
    offset: parseInt(sp.get("offset") || "0"),
    limit: Math.min(parseInt(sp.get("limit") || "20"), 100),
  }
}

/** 提取请求 Cookie header */
export function getCookieHeader(request: Request): string | null {
  return request.headers.get("cookie")
}

/** 递增 ID 生成器 */
export function nextId(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** 计算帖子的 score_avg 和 score_count */
export function computeScoreStats(postId: string): { score_avg: number | null; score_count: number } {
  const scores = store.scores.get(postId)
  if (!scores || scores.length === 0) return { score_avg: null, score_count: 0 }
  const avg = scores.reduce((sum, s) => sum + s.score, 0) / scores.length
  return {
    score_avg: Math.round(avg * 10) / 10,
    score_count: scores.length,
  }
}

/** 生成 time_label（类似后端的相对时间描述） */
export function timeLabel(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "刚刚"
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  return `${months}个月前`
}

/** 随机整数 [min, max] */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
