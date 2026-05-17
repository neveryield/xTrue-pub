/**
 * 用户模块 MSW handlers — 档案、收藏、订阅、打分历史。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { getUserIdFromRequest } from "../jwt"
import { getPagination, getCookieHeader, computeScoreStats, timeLabel } from "../utils"

export const usersHandlers = [

  // ── 档案 ──

  // 获取自己的完整档案（L1）
  http.get("*/api/v1/users/me", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "未登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const user = store.users.get(userId)
    if (!user) {
      return HttpResponse.json({ message: "用户不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    return HttpResponse.json({
      user_id: user.user_id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      user_level: user.user_level,
      credibility_score: user.credibility_score,
      is_staff: user.is_staff,
      created_at: user.created_at,
    })
  }),

  // 编辑自己的档案
  http.put("*/api/v1/users/me", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "未登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const user = store.users.get(userId)
    if (!user) {
      return HttpResponse.json({ message: "用户不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const body = (await request.json()) as { nickname?: string; avatar_url?: string }
    if (body.nickname !== undefined) user.nickname = body.nickname
    if (body.avatar_url !== undefined) user.avatar_url = body.avatar_url
    return HttpResponse.json({
      user_id: user.user_id, nickname: user.nickname,
      avatar_url: user.avatar_url, bio: user.bio,
      user_level: user.user_level, credibility_score: user.credibility_score,
      is_staff: user.is_staff, created_at: user.created_at,
    })
  }),

  // 注销账号
  http.delete("*/api/v1/users/me", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "未登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    store.users.delete(userId)
    return HttpResponse.json({ ok: true })
  }),

  // 获取他人公开主页
  http.get("*/api/v1/users/:userId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const viewerId = await getUserIdFromRequest(cookie)
    const user = store.users.get(params.userId as string)
    if (!user) {
      return HttpResponse.json({ message: "用户不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    return HttpResponse.json({
      user_id: user.user_id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      user_level: user.user_level,
      credibility_score: user.credibility_score,
      created_at: user.created_at,
    })
  }),

  // 获取该用户发表的帖子列表
  http.get("*/api/v1/users/:userId/posts", ({ params, request }) => {
    const { offset, limit } = getPagination(request.url)
    const posts = [...store.posts.values()]
      .filter((p) => p.author_id === params.userId && p.visibility === "public" && p.moderation_status === 2)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const total = posts.length
    const items = posts.slice(offset, offset + limit).map((p) => {
      const stats = computeScoreStats(p.post_id)
      return {
        post_id: p.post_id, category: p.category, subcategory: p.subcategory,
        author_id: p.author_id, title: p.title, content: p.content,
        images: p.images, visibility: p.visibility, moderation_status: p.moderation_status,
        authenticity_ack: p.authenticity_ack, created_at: p.created_at, updated_at: p.updated_at,
        score_avg: stats.score_avg, score_count: stats.score_count,
      }
    })

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // ── 收藏 ──

  // 收藏帖子
  http.post("*/api/v1/users/me/favorites/:postId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const favs = store.favorites.get(userId) ?? new Set()
    favs.add(params.postId as string)
    store.favorites.set(userId, favs)
    return HttpResponse.json({ ok: true })
  }),

  // 取消收藏
  http.delete("*/api/v1/users/me/favorites/:postId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const favs = store.favorites.get(userId)
    if (favs) favs.delete(params.postId as string)
    return HttpResponse.json({ ok: true })
  }),

  // 收藏列表
  http.get("*/api/v1/users/me/favorites", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const { offset, limit } = getPagination(request.url)
    const favIds = store.favorites.get(userId) ?? new Set()
    const posts = [...store.posts.values()]
      .filter((p) => favIds.has(p.post_id))

    const total = posts.length
    const items = posts.slice(offset, offset + limit).map((p) => {
      const stats = computeScoreStats(p.post_id)
      return {
        post_id: p.post_id, category: p.category, author_id: p.author_id,
        title: p.title, content: p.content, images: p.images,
        created_at: p.created_at, score_avg: stats.score_avg, score_count: stats.score_count,
      }
    })

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // ── 订阅 ──

  // 订阅用户
  http.post("*/api/v1/users/me/subscriptions/:userId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const subs = store.subscriptions.get(userId) ?? new Set()
    subs.add(params.userId as string)
    store.subscriptions.set(userId, subs)
    return HttpResponse.json({ ok: true })
  }),

  // 取消订阅
  http.delete("*/api/v1/users/me/subscriptions/:userId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const subs = store.subscriptions.get(userId)
    if (subs) subs.delete(params.userId as string)
    return HttpResponse.json({ ok: true })
  }),

  // 订阅列表
  http.get("*/api/v1/users/me/subscriptions", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const { offset, limit } = getPagination(request.url)
    const subIds = store.subscriptions.get(userId) ?? new Set()
    const users = [...store.users.values()].filter((u) => subIds.has(u.user_id))

    const total = users.length
    const items = users.slice(offset, offset + limit).map((u) => ({
      user_id: u.user_id, nickname: u.nickname, avatar_url: u.avatar_url,
      user_level: u.user_level, bio: u.bio,
    }))

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // 订阅时间线
  http.get("*/api/v1/users/me/subscriptions/posts", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const { offset, limit } = getPagination(request.url)
    const subIds = store.subscriptions.get(userId) ?? new Set()
    const posts = [...store.posts.values()]
      .filter((p) => subIds.has(p.author_id) && p.visibility === "public")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const total = posts.length
    const items = posts.slice(offset, offset + limit).map((p) => {
      const stats = computeScoreStats(p.post_id)
      return {
        post_id: p.post_id, category: p.category, author_id: p.author_id,
        title: p.title, content: p.content, created_at: p.created_at,
        score_avg: stats.score_avg, score_count: stats.score_count,
      }
    })

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // ── 打分历史 ──

  // 获取自己的打分历史
  http.get("*/api/v1/users/me/scores", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const { offset, limit } = getPagination(request.url)
    const allScores: { post_id: string; user_id: string; score: number }[] = []
    for (const [postId, scores] of store.scores) {
      const userScore = scores.find((s) => s.user_id === userId)
      if (userScore) allScores.push(userScore)
    }
    allScores.sort((a, b) => b.score - a.score)

    const total = allScores.length
    const items = allScores.slice(offset, offset + limit)

    return HttpResponse.json({ items, total, offset, limit })
  }),
]
