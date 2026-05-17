/**
 * 分享码模块 MSW handlers。
 */

import { http, HttpResponse } from "msw"
import { store } from "../data/store"

export const shareHandlers = [
  // 解析分享码
  http.get("*/api/v1/s/:shareCode", ({ params }) => {
    const code = params.shareCode as string
    // 简单模拟：根据分享码前缀路由到不同类型
    if (code.startsWith("sc_")) {
      const firstPost = [...store.posts.values()].find((p) => p.visibility === "public")
      if (firstPost) {
        return HttpResponse.json({
          type: "post",
          post_id: firstPost.post_id,
          share_code: code,
        })
      }
    }
    return HttpResponse.json({ message: "分享码无效或已过期", code: "NOT_FOUND" }, { status: 404 })
  }),
]
