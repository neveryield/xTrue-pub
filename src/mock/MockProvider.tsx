"use client"

import { useEffect, useState, type ReactNode } from "react"
import { seed } from "./data/seed"

/**
 * MockProvider — 在浏览器端条件启动 MSW 并灌入种子数据。
 *
 * 只在 NEXT_PUBLIC_MOCK_API=true 时激活。
 * 首次挂载时异步加载 MSW worker，避免阻塞页面渲染。
 */
export function MockProvider({ children }: { children?: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_MOCK_API === "true"
    if (!enabled) {
      setReady(true)
      return
    }

    // 延迟导入，避免生产构建包含 msw
    let cancelled = false
    const init = async () => {
      try {
        const { worker } = await import("./browser")
        seed()
        await worker.start({ onUnhandledRequest: "bypass", quiet: true })
      } catch (err) {
        console.warn("[mock] MSW init failed, falling back to real backend", err)
      }
      if (!cancelled) setReady(true)
    }
    init()
    return () => { cancelled = true }
  }, [])

  // 在 MSW 就绪前不渲染子组件，确保页面数据请求被正确拦截
  if (process.env.NEXT_PUBLIC_MOCK_API === "true" && !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FBFAF7]">
        <p className="text-sm text-[#8B8478] animate-pulse">Mock 数据加载中…</p>
      </div>
    )
  }

  return <>{children}</>
}
