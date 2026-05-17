/**
 * Mock 模块入口 — MockProvider 负责在浏览器端启动 MSW。
 *
 * 使用方式（layout.tsx）：
 *   import { MockProvider } from "@/mock"
 *   在 <body> 内添加 <MockProvider />
 */

export { MockProvider } from "./MockProvider"
export { seed } from "./data/seed"
export { store, clearStore } from "./data/store"
