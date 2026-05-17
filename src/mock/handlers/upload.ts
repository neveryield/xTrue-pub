/**
 * 上传模块 MSW handlers — 返回 picsum 随机真实感占位图。
 */

import { http, HttpResponse } from "msw"
import { nextId } from "../utils"

export const uploadHandlers = [
  http.post("*/api/v1/uploads/image", async () => {
    const filename = nextId("img_")
    const w = [800, 1024, 1200, 1600][Math.floor(Math.random() * 4)]
    const h = [600, 768, 800, 900][Math.floor(Math.random() * 4)]
    return HttpResponse.json({
      url: `https://picsum.photos/seed/${filename}/${w}/${h}`,
      filename: `${filename}.jpg`,
      size: Math.floor(Math.random() * 500000) + 50000,
    }, { status: 201 })
  }),
]
