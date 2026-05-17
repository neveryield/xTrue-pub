/**
 * 认证模块 MSW handlers — 实人认证状态查询和提交。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { getUserIdFromRequest } from "../jwt"
import { getCookieHeader, nextId } from "../utils"

export const certificationHandlers = [
  // 认证状态查询
  http.get("*/api/v1/certifications/status", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const certs = [...store.certifications.values()].filter((c) => c.user_id === userId)
    return HttpResponse.json({
      user_id: userId,
      real_name: certs.find((c) => c.cert_type === "real_name") ?? null,
      real_person: certs.find((c) => c.cert_type === "real_person") ?? null,
      trusted: certs.find((c) => c.cert_type === "trusted") ?? null,
    })
  }),

  // 实名认证
  http.post("*/api/v1/certifications/real-name", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const body = (await request.json()) as { real_name?: string; id_card?: string }
    const cert = {
      cert_id: nextId("cert_"),
      user_id: userId,
      cert_type: "real_name" as const,
      status: "approved" as const,
      real_name: body.real_name ?? null,
      id_card: body.id_card ?? null,
      created_at: new Date().toISOString(),
    }
    store.certifications.set(cert.cert_id, cert)

    // 升级用户等级到 L2
    const user = store.users.get(userId)
    if (user && user.user_level < 2) user.user_level = 2

    return HttpResponse.json(cert, { status: 201 })
  }),

  // 实人认证
  http.post("*/api/v1/certifications/real-person", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const cert = {
      cert_id: nextId("cert_"),
      user_id: userId,
      cert_type: "real_person" as const,
      status: "approved" as const,
      real_name: null,
      id_card: null,
      created_at: new Date().toISOString(),
    }
    store.certifications.set(cert.cert_id, cert)

    // 升级到 L3
    const user = store.users.get(userId)
    if (user && user.user_level < 3) user.user_level = 3

    return HttpResponse.json(cert, { status: 201 })
  }),

  // 会话验证
  http.post("*/api/v1/certifications/session-verify", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    return HttpResponse.json({
      verified: true,
      effective_level: store.users.get(userId)?.user_level ?? 1,
    })
  }),

  // 可信用户认证
  http.post("*/api/v1/certifications/trusted", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const body = (await request.json()) as { reason?: string }
    const cert = {
      cert_id: nextId("cert_"),
      user_id: userId,
      cert_type: "trusted" as const,
      status: "pending" as const,
      real_name: null,
      id_card: null,
      created_at: new Date().toISOString(),
    }
    store.certifications.set(cert.cert_id, cert)
    return HttpResponse.json(cert, { status: 201 })
  }),
]
