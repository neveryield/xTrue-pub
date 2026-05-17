/**
 * 品类模块 — 返回与 constants.ts SUBCATEGORIES 一致的静态品类树。
 */

import { http, HttpResponse } from "msw"

const CATEGORY_TREE = [
  {
    key: "dining", label: "餐饮",
    children: [
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
  },
  {
    key: "leisure", label: "游乐",
    children: [
      { key: "theme_park", label: "主题乐园" },
      { key: "board_game", label: "剧本杀/桌游" },
      { key: "escape_room", label: "密室逃脱" },
      { key: "concert", label: "演唱会" },
      { key: "exhibition", label: "展览" },
      { key: "esports", label: "电竞" },
      { key: "travel", label: "旅游景点" },
      { key: "hotel", label: "酒店民宿" },
    ],
  },
  {
    key: "media", label: "影音",
    children: [
      { key: "movie", label: "电影" },
      { key: "tv_series", label: "电视剧" },
      { key: "music", label: "音乐" },
      { key: "short_drama", label: "短剧" },
      { key: "video", label: "视频" },
    ],
  },
  {
    key: "other", label: "器物",
    children: [
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
  },
  {
    key: "free", label: "随谈",
    children: [
      { key: "discussion", label: "讨论" },
      { key: "tree_hole", label: "树洞" },
      { key: "voting", label: "投票" },
      { key: "other", label: "杂录" },
    ],
  },
]

export const categoriesHandlers = [
  http.get("*/api/v1/categories", () => {
    return HttpResponse.json({ categories: CATEGORY_TREE })
  }),
]
