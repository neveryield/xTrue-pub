/**
 * 风控模块 MSW handlers — 用户端风控检查和事件历史。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { getUserIdFromRequest } from "../jwt"
import { getCookieHeader, getPagination } from "../utils"

export const riskControlHandlers = [
  // 风控检查（自检）
  http.post("*/api/v1/risk-control/check", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const events = store.riskEvents.get(userId) ?? []
    const riskLevel = events.length > 5 ? "high" : events.length > 2 ? "medium" : "low"
    return HttpResponse.json({
      user_id: userId,
      risk_level: riskLevel,
      event_count: events.length,
      has_warnings: riskLevel !== "low",
    })
  }),

  // 风控事件历史（仅可查看自己的）
  http.get("*/api/v1/risk-control/events", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const { offset, limit } = getPagination(request.url)
    const events = store.riskEvents.get(userId) ?? []
    const total = events.length
    const items = events.slice(offset, offset + limit)

    return HttpResponse.json({ items, total, offset, limit })
  }),
]
