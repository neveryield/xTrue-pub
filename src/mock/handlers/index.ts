/**
 * 汇总所有 MSW handlers。
 */

import { authHandlers } from "./auth"
import { postsHandlers } from "./posts"
import { categoriesHandlers } from "./categories"
import { healthHandlers } from "./health"
import { usersHandlers } from "./users"
import { uploadHandlers } from "./upload"
import { aiHandlers } from "./ai"
import { shareHandlers } from "./share"
import { certificationHandlers } from "./certification"
import { reportsHandlers } from "./reports"
import { riskControlHandlers } from "./risk-control"

export const allHandlers = [
  ...authHandlers,
  ...postsHandlers,
  ...categoriesHandlers,
  ...healthHandlers,
  ...usersHandlers,
  ...uploadHandlers,
  ...aiHandlers,
  ...shareHandlers,
  ...certificationHandlers,
  ...reportsHandlers,
  ...riskControlHandlers,
]
