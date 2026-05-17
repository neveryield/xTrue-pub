/**
 * 帖子模块 MSW handlers — CRUD + 评论 + 打分 + 表态 + 分享 + 删除申请。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { createMockPost, createMockComment } from "../data/factories"
import { getUserIdFromRequest } from "../jwt"
import { getPagination, getCookieHeader, nextId, computeScoreStats, timeLabel, randInt } from "../utils"

// ── 帖子 CRUD ──

export const postsHandlers = [

  // 帖子列表
  http.get("*/api/v1/posts", ({ request }) => {
    const sp = new URL(request.url).searchParams
    const category = sp.get("category") || ""
    const subcategory = sp.get("subcategory") || ""
    const keyword = sp.get("keyword") || ""
    const { offset, limit } = getPagination(request.url)

    let posts = [...store.posts.values()]
      .filter((p) => p.visibility === "public" && p.moderation_status === 2)

    if (category) posts = posts.filter((p) => p.category === category)
    if (subcategory) posts = posts.filter((p) => p.subcategory === subcategory)
    if (keyword) {
      const kw = keyword.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw)
      )
    }

    // 按时间倒序
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const total = posts.length
    const items = posts.slice(offset, offset + limit).map((p) => {
      const stats = computeScoreStats(p.post_id)
      return {
        post_id: p.post_id,
        category: p.category,
        subcategory: p.subcategory,
        author_id: p.author_id,
        title: p.title,
        content: p.content,
        images: p.images,
        visibility: p.visibility,
        moderation_status: p.moderation_status,
        authenticity_ack: p.authenticity_ack,
        created_at: p.created_at,
        updated_at: p.updated_at,
        score_avg: stats.score_avg,
        score_count: stats.score_count,
      }
    })

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // 帖子详情
  http.get("*/api/v1/posts/:postId", ({ params }) => {
    const post = store.posts.get(params.postId as string)
    if (!post || post.visibility !== "public") {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const stats = computeScoreStats(post.post_id)
    return HttpResponse.json({
      post_id: post.post_id,
      category: post.category,
      subcategory: post.subcategory,
      author_id: post.author_id,
      title: post.title,
      content: post.content,
      images: post.images,
      visibility: post.visibility,
      moderation_status: post.moderation_status,
      authenticity_ack: post.authenticity_ack,
      created_at: post.created_at,
      updated_at: post.updated_at,
      score_avg: stats.score_avg,
      score_count: stats.score_count,
    })
  }),

  // 创建帖子
  http.post("*/api/v1/posts", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const user = store.users.get(userId)
    if (!user || user.user_level < 5) {
      return HttpResponse.json({ message: "L5及以上用户才能发帖", code: "FORBIDDEN" }, { status: 403 })
    }

    const body = (await request.json()) as {
      category?: string; subcategory?: string; content?: string
      title?: string; images?: string[]; authenticity_ack?: boolean
    }
    if (!body.category || !body.content) {
      return HttpResponse.json({ message: "分类和内容不能为空", code: "VALIDATION" }, { status: 422 })
    }

    const now = new Date().toISOString()
    const post = createMockPost({
      category: body.category,
      subcategory: body.subcategory ?? "",
      author_id: userId,
      title: body.title ?? null,
      content: body.content,
      images: body.images ?? [],
      authenticity_ack: body.authenticity_ack ?? true,
      created_at: now,
      updated_at: now,
    })
    store.posts.set(post.post_id, post)
    store.scores.set(post.post_id, [])

    return HttpResponse.json({
      post_id: post.post_id,
      category: post.category,
      subcategory: post.subcategory,
      author_id: post.author_id,
      title: post.title,
      content: post.content,
      images: post.images,
      visibility: post.visibility,
      moderation_status: post.moderation_status,
      authenticity_ack: post.authenticity_ack,
      created_at: post.created_at,
      updated_at: post.updated_at,
      score_avg: null,
      score_count: 0,
    }, { status: 201 })
  }),

  // 更新帖子
  http.put("*/api/v1/posts/:postId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const post = store.posts.get(params.postId as string)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    if (post.author_id !== userId) {
      return HttpResponse.json({ message: "只能修改自己的帖子", code: "FORBIDDEN" }, { status: 403 })
    }

    const body = (await request.json()) as { title?: string; content?: string; category?: string; subcategory?: string }
    if (body.title !== undefined) post.title = body.title
    if (body.content !== undefined) post.content = body.content
    if (body.category !== undefined) post.category = body.category
    if (body.subcategory !== undefined) post.subcategory = body.subcategory
    post.updated_at = new Date().toISOString()

    const stats = computeScoreStats(post.post_id)
    return HttpResponse.json({
      post_id: post.post_id, category: post.category, subcategory: post.subcategory,
      author_id: post.author_id, title: post.title, content: post.content,
      images: post.images, visibility: post.visibility, moderation_status: post.moderation_status,
      authenticity_ack: post.authenticity_ack,
      created_at: post.created_at, updated_at: post.updated_at,
      score_avg: stats.score_avg, score_count: stats.score_count,
    })
  }),

  // 删除帖子
  http.delete("*/api/v1/posts/:postId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const post = store.posts.get(params.postId as string)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    if (post.author_id !== userId) {
      return HttpResponse.json({ message: "只能删除自己的帖子", code: "FORBIDDEN" }, { status: 403 })
    }
    store.posts.delete(post.post_id)
    store.scores.delete(post.post_id)
    // 删除关联评论
    for (const [cid, c] of store.comments) {
      if (c.post_id === post.post_id) store.comments.delete(cid)
    }
    return HttpResponse.json({ ok: true })
  }),

  // ── 打分 ──

  // 获取打分统计
  http.get("*/api/v1/posts/:postId/scores", ({ params }) => {
    const post = store.posts.get(params.postId as string)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const stats = computeScoreStats(post.post_id)
    return HttpResponse.json({
      post_id: post.post_id,
      score_avg: stats.score_avg,
      score_count: stats.score_count,
    })
  }),

  // 提交/更新打分
  http.post("*/api/v1/posts/:postId/scores", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const postId = params.postId as string
    const post = store.posts.get(postId)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }

    const body = (await request.json()) as { score?: number }
    const score = body.score ?? 0
    if (score < 0 || score > 100) {
      return HttpResponse.json({ message: "分数须在0-100之间", code: "VALIDATION" }, { status: 422 })
    }

    let scores = store.scores.get(postId) ?? []
    const idx = scores.findIndex((s) => s.user_id === userId)
    if (idx >= 0) {
      scores[idx].score = score
    } else {
      scores.push({ post_id: postId, user_id: userId, score })
    }
    store.scores.set(postId, scores)

    const stats = computeScoreStats(postId)
    return HttpResponse.json({
      post_id: postId,
      user_id: userId,
      score,
      score_avg: stats.score_avg,
      score_count: stats.score_count,
    })
  }),

  // ── 评论 ──

  // 评论列表
  http.get("*/api/v1/posts/:postId/comments", ({ params, request }) => {
    const post = store.posts.get(params.postId as string)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const { offset, limit } = getPagination(request.url)
    let comments = [...store.comments.values()]
      .filter((c) => c.post_id === post.post_id)
    comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const total = comments.length
    const items = comments.slice(offset, offset + limit).map((c) => ({
      comment_id: c.comment_id,
      post_id: c.post_id,
      author_id: c.author_id,
      content: c.content,
      images: c.images,
      quote_comment_id: c.quote_comment_id,
      moderation_status: c.moderation_status,
      time_label: timeLabel(c.created_at),
      agree_count: c.agree_count,
      disagree_count: c.disagree_count,
      quoted_comment: c.quote_comment_id
        ? (() => {
            const qc = store.comments.get(c.quote_comment_id!)
            return qc ? {
              comment_id: qc.comment_id,
              post_id: qc.post_id,
              author_id: qc.author_id,
              content: qc.content,
              images: qc.images,
              quote_comment_id: qc.quote_comment_id,
              moderation_status: qc.moderation_status,
              time_label: timeLabel(qc.created_at),
              agree_count: qc.agree_count,
              disagree_count: qc.disagree_count,
              quoted_comment: null,
            } : null
          })()
        : null,
    }))

    return HttpResponse.json({ items, total, offset, limit })
  }),

  // 发表评论
  http.post("*/api/v1/posts/:postId/comments", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const postId = params.postId as string
    const post = store.posts.get(postId)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }

    const body = (await request.json()) as { content?: string; images?: string[]; quote_comment_id?: string }
    if (!body.content) {
      return HttpResponse.json({ message: "评论内容不能为空", code: "VALIDATION" }, { status: 422 })
    }

    const comment = createMockComment({
      post_id: postId,
      author_id: userId,
      content: body.content,
      images: body.images ?? [],
      quote_comment_id: body.quote_comment_id ?? null,
    })
    store.comments.set(comment.comment_id, comment)

    return HttpResponse.json({
      comment_id: comment.comment_id,
      post_id: comment.post_id,
      author_id: comment.author_id,
      content: comment.content,
      images: comment.images,
      quote_comment_id: comment.quote_comment_id,
      moderation_status: comment.moderation_status,
      time_label: timeLabel(comment.created_at),
      agree_count: 0,
      disagree_count: 0,
      quoted_comment: null,
    }, { status: 201 })
  }),

  // 编辑评论
  http.put("*/api/v1/posts/:postId/comments/:commentId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const comment = store.comments.get(params.commentId as string)
    if (!comment || comment.author_id !== userId) {
      return HttpResponse.json({ message: "评论不存在或无权修改", code: "FORBIDDEN" }, { status: 403 })
    }
    const body = (await request.json()) as { content?: string }
    if (body.content) comment.content = body.content
    return HttpResponse.json({
      comment_id: comment.comment_id, post_id: comment.post_id, author_id: comment.author_id,
      content: comment.content, images: comment.images, quote_comment_id: comment.quote_comment_id,
      moderation_status: comment.moderation_status, time_label: timeLabel(comment.created_at),
      agree_count: comment.agree_count, disagree_count: comment.disagree_count,
      quoted_comment: null,
    })
  }),

  // 删除评论
  http.delete("*/api/v1/posts/:postId/comments/:commentId", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const comment = store.comments.get(params.commentId as string)
    if (!comment) {
      return HttpResponse.json({ message: "评论不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    if (comment.author_id !== userId) {
      return HttpResponse.json({ message: "只能删除自己的评论", code: "FORBIDDEN" }, { status: 403 })
    }
    store.comments.delete(comment.comment_id)
    return HttpResponse.json({ ok: true })
  }),

  // ── 评论表态 ──

  // 表态（赞/踩）
  http.post("*/api/v1/posts/:postId/comments/:commentId/reaction", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const comment = store.comments.get(params.commentId as string)
    if (!comment) {
      return HttpResponse.json({ message: "评论不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const body = (await request.json()) as { type?: string }
    if (body.type === "agree") comment.agree_count++
    else if (body.type === "disagree") comment.disagree_count++
    return HttpResponse.json({
      comment_id: comment.comment_id, post_id: comment.post_id, author_id: comment.author_id,
      content: comment.content, images: comment.images, quote_comment_id: comment.quote_comment_id,
      moderation_status: comment.moderation_status, time_label: timeLabel(comment.created_at),
      agree_count: comment.agree_count, disagree_count: comment.disagree_count,
      quoted_comment: null,
    })
  }),

  // 取消表态
  http.delete("*/api/v1/posts/:postId/comments/:commentId/reaction", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const comment = store.comments.get(params.commentId as string)
    if (!comment) {
      return HttpResponse.json({ message: "评论不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    return HttpResponse.json({
      comment_id: comment.comment_id, post_id: comment.post_id, author_id: comment.author_id,
      content: comment.content, images: comment.images, quote_comment_id: comment.quote_comment_id,
      moderation_status: comment.moderation_status, time_label: timeLabel(comment.created_at),
      agree_count: comment.agree_count, disagree_count: comment.disagree_count,
      quoted_comment: null,
    })
  }),

  // ── 分享 ──
  http.post("*/api/v1/posts/:postId/share", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const post = store.posts.get(params.postId as string)
    if (!post) {
      return HttpResponse.json({ message: "帖子不存在", code: "NOT_FOUND" }, { status: 404 })
    }
    const shareCode = nextId("sc_").slice(0, 8)
    return HttpResponse.json({
      share_code: shareCode,
      share_url: `/s/${shareCode}`,
    })
  }),

  // ── 删除申请 ──
  http.post("*/api/v1/posts/:postId/delete-request", async ({ params, request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const body = (await request.json()) as { reason?: string }
    return HttpResponse.json({ request_id: nextId("dr_") }, { status: 201 })
  }),

  http.post("*/api/v1/posts/:postId/comments/:commentId/delete-request", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    return HttpResponse.json({ request_id: nextId("cdr_") }, { status: 201 })
  }),
]
