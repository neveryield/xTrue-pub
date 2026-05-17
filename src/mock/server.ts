/**
 * MSW server — SSR 场景预留（暂无使用，供未来 RSC 数据 mock 参考）。
 */

import { setupServer } from "msw/node"
import { allHandlers } from "./handlers"

export const server = setupServer(...allHandlers)
