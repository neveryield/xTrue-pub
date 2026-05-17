/**
 * Mock JWT 签发与解析 — 与 middleware 共享 secret。
 */

import { SignJWT, jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "xTrue-mock-demo-key-2026"
)

export function signJWT(payload: Record<string, unknown>, expiresIn = "1h"): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET)
}

export async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] })
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const binStr = atob(base64)
  const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * 从请求 Cookie 中提取 user_id。
 * 优先验证 JWT，其次尝试 base64url 裸解码（兼容 middleware 的无 secret 模式）。
 */
export async function getUserIdFromRequest(cookieHeader: string | null): Promise<string | null> {
  if (!cookieHeader) return null

  const match = cookieHeader.match(/access_token=([^;]+)/)
  if (!match) return null

  const token = match[1]

  // 先尝试 JWT 验证
  const payload = await verifyJWT(token)
  if (payload && payload.sub) return String(payload.sub)

  // 降级：base64url 解码 payload（浏览器兼容，无 secret 时生效）
  try {
    const parts = token.split(".")
    if (parts.length === 3) {
      const raw = JSON.parse(base64UrlDecode(parts[1]))
      if (raw.sub) return String(raw.sub)
    }
  } catch { /* ignore */ }

  return null
}
