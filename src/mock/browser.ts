/**
 * MSW browser worker — 浏览器端 Service Worker 初始化。
 */

import { setupWorker } from "msw/browser"
import { allHandlers } from "./handlers"

export const worker = setupWorker(...allHandlers)
