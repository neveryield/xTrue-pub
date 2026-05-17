/**
 * 举报模块 MSW handlers。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"
import { getUserIdFromRequest } from "../jwt"
import { getCookieHeader, nextId } from "../utils"

export const reportsHandlers = [
  // 提交举报
  http.post("*/api/v1/reports", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const body = (await request.json()) as { target_type?: string; target_id?: string; reason?: string }
    if (!body.target_type || !body.target_id || !body.reason) {
      return HttpResponse.json({ message: "请填写完整信息", code: "VALIDATION" }, { status: 422 })
    }
    const report = {
      report_id: nextId("rpt_"),
      reporter_id: userId,
      target_type: body.target_type as "post" | "comment",
      target_id: body.target_id,
      reason: body.reason,
      status: "pending" as const,
      created_at: new Date().toISOString(),
    }
    store.reports.set(report.report_id, report)
    return HttpResponse.json({ report_id: report.report_id }, { status: 201 })
  }),

  // 查看自己的举报
  http.get("*/api/v1/reports", async ({ request }) => {
    const cookie = getCookieHeader(request)
    const userId = await getUserIdFromRequest(cookie)
    if (!userId) {
      return HttpResponse.json({ message: "请先登录", code: "UNAUTHORIZED" }, { status: 401 })
    }
    const items = [...store.reports.values()].filter((r) => r.reporter_id === userId)
    return HttpResponse.json({ items, total: items.length })
  }),
]
