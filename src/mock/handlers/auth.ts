/**
 * 认证模块 MSW handlers — 登录/注册/登出/刷新/会话管理。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { seed } from "../data/seed"
import { signJWT } from "../jwt"
import { getCookieHeader, nextId } from "../utils"
import { getUserIdFromRequest } from "../jwt"

const COOKIE_OPTS = "HttpOnly; Path=/; SameSite=Lax; Max-Age=3600"

function makeLoginResponse(userId: string, level: number) {
  return {
    user_id: userId,
    user_level: level,
    expires_in: 3600,
  }
}

async function makeAuthCookies(userId: string): Promise<[string, string]> {
  const accessToken = await signJWT({ sub: userId }, "1h")
  const refreshToken = `rt_${nextId()}`
  store.refreshTokens.set(refreshToken, userId)
  return [
    `access_token=${accessToken}; ${COOKIE_OPTS}`,
    `refresh_token=${refreshToken}; ${COOKIE_OPTS}`,
  ]
}

/** 查找用户：匹配手机号、邮箱或用户名 */
function findUserByAccount(account: string) {
  const s = account.trim()
  // 手机号
  if (/^1[3-9]\d{9}$/.test(s)) {
    const phoneHash = `hash_phone_${s}`
    for (const u of store.users.values()) {
      if (u.phone_hash === phoneHash) return u
    }
  }
  // 邮箱
  if (s.includes("@")) {
    const emailHash = `hash_email_${s.toLowerCase()}`
    for (const u of store.users.values()) {
      if (u.email_hash === emailHash) return u
    }
  }
  // 用户名
  const norm = s.toLowerCase()
  for (const u of store.users.values()) {
    if (u.username_norm === norm) return u
  }
  return null
}

export const authHandlers = [
  // ── 注册 ──
  http.post("*/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as { account?: string; password?: string }
    if (!body.account || !body.password) {
      return HttpResponse.json({ message: "账号和密码不能为空", code: "VALIDATION" }, { status: 422 })
    }
    if (body.password.length < 8) {
      return HttpResponse.json({ message: "密码至少8位", code: "WEAK_PASSWORD" }, { status: 422 })
    }
    if (findUserByAccount(body.account)) {
      return HttpResponse.json({ message: "该账号已注册", code: "ACCOUNT_EXISTS" }, { status: 409 })
    }

    // 创建新用户
    const userId = nextId("u_")
    const norm = body.account.trim().toLowerCase()
    const newUser = {
      user_id: userId,
      nickname: `新用户_${userId.slice(-4)}`,
      phone_hash: /^1[3-9]\d{9}$/.test(body.account) ? `hash_phone_${body.account}` : `hash_phone_${userId}`,
      email_hash: body.account.includes("@") ? `hash_email_${norm}` : null,
      username_norm: norm,
      password_hash: body.password,
      user_level: 1,
      avatar_url: null,
      bio: null,
      credibility_score: 50,
      is_staff: false,
      created_at: new Date().toISOString(),
    }
    store.users.set(userId, newUser)

    const [ac, rc] = await makeAuthCookies(userId)
    const resp = HttpResponse.json(makeLoginResponse(userId, 1), { status: 201 })
    resp.headers.append("Set-Cookie", ac)
    resp.headers.append("Set-Cookie", rc)
    return resp
  }),

  // ── 密码登录 ──
  http.post("*/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as { account?: string; password?: string }
    if (!body.account || !body.password) {
      return HttpResponse.json({ message: "账号和密码不能为空", code: "VALIDATION" }, { status: 422 })
    }
    const user = findUserByAccount(body.account)
    if (!user) {
      return HttpResponse.json({ message: "账号或密码错误", code: "INVALID_CREDENTIALS" }, { status: 401 })
    }
    if (user.password_hash !== body.password) {
      return HttpResponse.json({ message: "账号或密码错误", code: "INVALID_CREDENTIALS" }, { status: 401 })
    }

    const [ac, rc] = await makeAuthCookies(user.user_id)

    // 创建 session
    const sessions = store.sessions.get(user.user_id) ?? []
    sessions.push({ session_id: nextId("sess_"), user_id: user.user_id, last_seen_at: new Date().toISOString() })
    store.sessions.set(user.user_id, sessions)

    const resp = HttpResponse.json(makeLoginResponse(user.user_id, user.user_level))
    resp.headers.append("Set-Cookie", ac)
    resp.headers.append("Set-Cookie", rc)
    return resp
  }),

  // ── 短信发送 ──
  http.post("*/api/v1/auth/sms/send", async () => {
    return HttpResponse.json({ message: "验证码已发送", expires_in: 300 })
  }),

  // ── 短信登录 ──
  http.post("*/api/v1/auth/sms/login", async ({ request }) => {
    const body = (await request.json()) as { phone?: string; code?: string }
    if (!body.phone || !body.code) {
      return HttpResponse.json({ message: "手机号和验证码不能为空", code: "VALIDATION" }, { status: 422 })
    }
    let user = findUserByAccount(body.phone)
    if (!user) {
      // 自动注册
      const userId = nextId("u_")
      user = {
        user_id: userId, nickname: `用户_${body.phone.slice(-4)}`,
        phone_hash: `hash_phone_${body.phone}`, email_hash: null,
        username_norm: `phone_${body.phone}`, password_hash: "",
        user_level: 1, avatar_url: null, bio: null,
        credibility_score: 50, is_staff: false,
        created_at: new Date().toISOString(),
      }
      store.users.set(userId, user)
    }

    const [ac, rc] = await makeAuthCookies(user.user_id)
    const resp = HttpResponse.json(makeLoginResponse(user.user_id, user.user_level))
    resp.headers.append("Set-Cookie", ac)
    resp.headers.append("Set-Cookie", rc)
    return resp
  }),

  // ── 刷新 Token ──
  http.post("*/api/v1/auth/refresh", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const match = cookie?.match(/refresh_token=([^;]+)/)
    if (!match || !store.refreshTokens.has(match[1])) {
      return HttpResponse.json({ message: "Token 无效或已过期", code: "INVALID_TOKEN" }, { status: 401 })
    }
    const userId = store.refreshTokens.get(match[1])!
    store.refreshTokens.delete(match[1])

    const [ac, rc] = await makeAuthCookies(userId)
    const user = store.users.get(userId)
    const resp = HttpResponse.json(makeLoginResponse(userId, user?.user_level ?? 1))
    resp.headers.append("Set-Cookie", ac)
    resp.headers.append("Set-Cookie", rc)
    return resp
  }),

  // ── 登出 ──
  http.post("*/api/v1/auth/logout", async ({ request }) => {
    const cookie = getCookieHeader(request)
    if (cookie) {
      const am = cookie.match(/access_token=([^;]+)/)
      const rm = cookie.match(/refresh_token=([^;]+)/)
      if (am) store.tokenBlacklist.add(am[1])
      if (rm) store.refreshTokens.delete(rm[1])
    }
    const resp = HttpResponse.json({ message: "已登出" })
    resp.headers.append("Set-Cookie", "access_token=; HttpOnly; Path=/; Max-Age=0")
    resp.headers.append("Set-Cookie", "refresh_token=; HttpOnly; Path=/; Max-Age=0")
    return resp
  }),

  // ── 获取当前用户（/users/me，auth store restore 用） ──
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

  // ── 修改密码 ──
  http.put("*/api/v1/auth/password", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "未登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const body = (await request.json()) as { old_password?: string; new_password?: string }
    const user = store.users.get(userId)
    if (!user || user.password_hash !== body.old_password) {
      return HttpResponse.json({ message: "原密码错误", code: "WRONG_PASSWORD" }, { status: 403 })
    }
    user.password_hash = body.new_password ?? user.password_hash
    return HttpResponse.json({ message: "密码修改成功" })
  }),

  // ── 会话列表 ──
  http.get("*/api/v1/auth/sessions", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "未登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const sessions = store.sessions.get(userId) ?? []
    return HttpResponse.json({
      items: sessions.map((s) => ({
        session_id: s.session_id,
        current: true,
        last_seen_at: s.last_seen_at,
      })),
    })
  }),

  // ── 踢出会话 ──
  http.delete("*/api/v1/auth/sessions/:sessionId", async () => {
    return HttpResponse.json({ message: "会话已失效" })
  }),
]
