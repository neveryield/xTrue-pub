/**
 * 健康检查 handler。
 */

import { http, HttpResponse } from "msw"

export const healthHandlers = [
  http.get("*/api/v1/health", () => {
    return HttpResponse.json({ status: "ok", mongo: true, redis: true })
  }),
]
