/** 应用常量 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth?tab=login",
  REGISTER: "/auth?tab=register",
  /** @deprecated 使用 POSTS */
  PRODUCTS: "/",
  /** @deprecated 使用 POST_DETAIL */
  PRODUCT_DETAIL: (id: string | number) => `/posts/${id}`,
  POSTS: "/",
  POST_DETAIL: (id: string | number) => `/posts/${id}`,
  POST_NEW: "/posts/new",
  USER_PROFILE: (id: string | number) => `/users/${id}`,
  CERTIFICATION: "/certification",
} as const;

/** 管理后台路由（与主站隔离，前缀 /xtrue-admin） */
export const ADMIN_ROUTES = {
  ROOT: "/xtrue-admin",
  FORBIDDEN: "/xtrue-admin/forbidden",
  BLACKLIST: "/xtrue-admin/blacklist",
  RISK_EVENTS: "/xtrue-admin/risk-events",
  USERS: "/xtrue-admin/users",
  REVIEWS: "/xtrue-admin/reviews",
  CERTIFICATIONS: "/xtrue-admin/certifications",
  ARBITRATION: "/xtrue-admin/arbitration",
} as const;

/** 认同度评分范围 0-100 */
export const AGREEMENT = {
  SCORE_MIN: 0,
  SCORE_MAX: 100,
  /** 低认同度阈值 */
  LOW_THRESHOLD: 40,
  /** 高认同度阈值 */
  HIGH_THRESHOLD: 70,
  CONTENT_MAX_LENGTH: 5000,
} as const;

/** @deprecated 使用 AGREEMENT */
export const REVIEW = {
  SCORE_MIN: 0,
  SCORE_MAX: 100,
  CONTENT_MAX_LENGTH: 5000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const VERIFIED_TAG = "已验证";

/** 用户层级定义 */
export const USER_LEVEL = {
  0: { label: "游客", shortLabel: "L0", description: "仅浏览" },
  1: { label: "注册用户", shortLabel: "L1", description: "刚注册" },
  2: { label: "基础用户", shortLabel: "L2", description: "可打分" },
  3: { label: "实名用户", shortLabel: "L3", description: "可评论+打分" },
  4: { label: "实人认证用户", shortLabel: "L4", description: "可发帖（需当次验证）" },
  5: { label: "大V", shortLabel: "L5 可信", description: "可发帖（免当次验证）" },
} as const;

export type UserLevelType = keyof typeof USER_LEVEL;

/** 品类配置 */
export const CATEGORIES = [
  { key: "dining", label: "餐饮", icon: "🍜", colorKey: "food" as const },
  { key: "leisure", label: "游乐", icon: "🎡", colorKey: "leisure" as const },
  { key: "media", label: "影音", icon: "🎬", colorKey: "media" as const },
  { key: "other", label: "器物", icon: "📦", colorKey: "other" as const },
  { key: "free", label: "随谈", icon: "💬", colorKey: "free" as const },
] as const;

/** 品类标签映射 */
export const CATEGORY_LABELS: Record<string, string> = {
  dining: "餐饮",
  leisure: "游乐",
  media: "影音",
  other: "器物",
  free: "随谈",
};

/** 品类主题色配置 — 统一管理，避免各组件重复定义 */
export const CAT_COLORS: Record<string, { bg: string; text: string; stripe: string }> = {
  dining:  { bg: "#FDF5EF",  text: "#B86E3E",  stripe: "linear-gradient(180deg, #D4945C, #C17A44)" },
  leisure: { bg: "#EDF8F3",  text: "#3D7B5F",  stripe: "linear-gradient(180deg, #4EA07A, #3B8B63)" },
  media:   { bg: "#F4F0FA",  text: "#6B4E9B",  stripe: "linear-gradient(180deg, #8B6FC0, #7B5EAD)" },
  other:   { bg: "#EEF4FA",  text: "#4A7CA5",  stripe: "linear-gradient(180deg, #5C94BE, #4B84AE)" },
  free:    { bg: "#FDF0F3",  text: "#B85C72",  stripe: "linear-gradient(180deg, #D4788E, #C4647A)" },
};

/** 品类子类映射（与后端 categories.py 保持一致） */
export const SUBCATEGORIES: Record<string, { key: string; label: string }[]> = {
  dining: [
    { key: "hotpot", label: "火锅" },
    { key: "barbecue", label: "烧烤" },
    { key: "buffet", label: "自助餐" },
    { key: "chinese", label: "中餐" },
    { key: "western", label: "西餐" },
    { key: "japanese", label: "日料" },
    { key: "korean", label: "韩餐" },
    { key: "cafe", label: "咖啡/茶饮" },
    { key: "dessert", label: "甜品" },
    { key: "snack", label: "小吃" },
  ],
  leisure: [
    { key: "theme_park", label: "主题乐园" },
    { key: "board_game", label: "剧本杀/桌游" },
    { key: "escape_room", label: "密室逃脱" },
    { key: "concert", label: "演唱会" },
    { key: "exhibition", label: "展览" },
    { key: "esports", label: "电竞" },
    { key: "travel", label: "旅游景点" },
    { key: "hotel", label: "酒店民宿" },
  ],
  media: [
    { key: "movie", label: "电影" },
    { key: "tv_series", label: "电视剧" },
    { key: "music", label: "音乐" },
    { key: "short_drama", label: "短剧" },
    { key: "video", label: "视频" },
  ],
  other: [
    { key: "phone", label: "手机" },
    { key: "computer", label: "电脑" },
    { key: "audio", label: "音频设备" },
    { key: "camera", label: "相机/航拍" },
    { key: "home_appliance", label: "家电" },
    { key: "kitchen", label: "厨房电器" },
    { key: "car", label: "汽车" },
    { key: "sports", label: "运动户外" },
    { key: "beauty", label: "美妆个护" },
    { key: "furniture", label: "家居" },
  ],
  free: [
    { key: "discussion", label: "讨论" },
    { key: "tree_hole", label: "树洞" },
    { key: "voting", label: "投票" },
    { key: "other", label: "杂录" },
  ],
};
