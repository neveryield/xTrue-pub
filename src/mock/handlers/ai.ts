/**
 * AI 辅助模块 MSW handlers — 格式化 + 合规检测（正则匹配）。
 */

import { http, HttpResponse } from "msw"

const SENSITIVE_PATTERNS = [
  /赌博/, /博彩/, /网贷/, /办证/, /枪支/, /毒品/, /违禁/,
  /招嫖/, /卖淫/, /代孕/, /赌博/,
]

export const aiHandlers = [
  // HTML 格式化
  http.post("*/api/v1/ai/format", async ({ request }) => {
    const body = (await request.json()) as { content?: string }
    const raw = body.content ?? ""
    // 简单模拟：返回一份「格式化后的 HTML」
    const formatted = raw
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("\n")
    return HttpResponse.json({ formatted_content: formatted })
  }),

  // 合规检测
  http.post("*/api/v1/ai/compliance-check", async ({ request }) => {
    const body = (await request.json()) as { content?: string }
    const text = body.content ?? ""

    const hits: string[] = []
    for (const pattern of SENSITIVE_PATTERNS) {
      const match = text.match(pattern)
      if (match) hits.push(match[0])
    }

    if (hits.length > 0) {
      return HttpResponse.json({
        passed: false,
        message: `内容包含敏感词：${hits.join("、")}`,
        hits,
      })
    }

    return HttpResponse.json({ passed: true, message: "合规检测通过", hits: [] })
  }),
]
