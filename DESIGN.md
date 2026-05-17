# xTrue Design Specification | 前端设计规范

## 1. Overview | 概述

xTrue 是一个真实评价平台，视觉语言定位为**温暖、信赖、东方质感**。

- **Design DNA**: 米白暖色调 + 东方器物美学 + 轻量极简
- **Core Goal**: 让真实评价可信、可感，消除视觉噪音

---

## 2. Color Palette | 色彩体系

```yaml
colors:
  background:
    primary: "#FBFAF7"    # 暖白主背景
    card: "#FFFFFF"       # 卡片白
    warm: "#FDFCF0"       # 暖黄底（餐饮板块）
  text:
    primary: "#1E1B18"    # 主文字（暖黑）
    secondary: "#8B8478"  # 次级文字（暖灰）
    muted: "#B8B0A4"      # 辅助文字
  brand:
    amber: "#C67B5C"      # 品牌暖棕（链接/强调）
    amber_light: "#F5E6D3" # 品牌浅棕
    blue: "#3B82F6"       # 科技蓝（器物板块）
    green_emerald: "#0C5C38" # 翠绿（游乐板块）
    red: "#E34D2F"        # 餐饮暖红
  category:
    dining: "#E34D2F"     # 餐饮 · 暖红
    leisure: "#0C5C38"    # 游乐 · 翠绿
    media: "#7C3AED"      # 影音 · 紫
    other: "#3B82F6"      # 器物 · 科技蓝
    free: "#1E1B18"       # 随谈 · 暖黑
```

---

## 3. Typography | 字体规范

```yaml
typography:
  family: "system-ui, -apple-system, sans-serif"
  display: "font-display (serif fallback for headlines)"
  sizes:
    hero: "text-4xl ~ text-7xl"
    h1: "text-3xl ~ text-5xl"
    h2: "text-2xl"
    body: "text-sm ~ text-base"
    caption: "text-[10px] ~ text-xs"
  tracking:
    hero: "tight"
    label: "widest (uppercase badges)"
```

---

## 4. Layout | 布局

```yaml
layout:
  max_width: "max-w-6xl (1280px)"
  content_padding: "px-5"
  header_height: "h-14 (56px)"
  card_radius: "rounded-xl"
  section_gap: "mt-10 ~ mt-12"
```

---

## 5. Components | 核心组件

- **Header**: sticky, 毛玻璃效果, 品类导航 + 用户下拉菜单
- **Hero**: 品类切换按钮群（HomeHero），各品类独立 Hero（OtherHero / DiningHero / MediaHero / LeisureHero）
- **Post Cards**: 按品类不同风格 — 餐饮杂志风、器物极简工业风、影音沉浸式、游乐活力风、随谈轻社区
- **Score Ring**: 认同度 0-100 环形展示
- **Pagination**: 统一分页组件
- **Stats Bar**: 四列数据统计（累计帖子 / 认同度 / 认证用户 / 审核通过率）
- **CTA**: 注册引导区

---

## 6. Pages | 页面结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 多品类布局 + Hero + 精选/各板块 + 全域脉动 |
| `/auth?tab=login\|register` | 登录/注册 | 手机号/用户名/邮箱登录，JWT httpOnly Cookie |
| `/posts/[id]` | 帖子详情 | 内容 + 评论区 + 认同度打分 + 共鸣卡片 |
| `/posts/new` | 发帖 | 需 L4+，middleware 保护 |
| `/users/[id]` | 用户主页 | 用户信息 + 发帖历史 |
| `/xtrue-admin/*` | 管理后台 | 需管理员 user_id，middleware 保护 |

---

## 7. Auth Flow | 认证流程

- JWT 存储在 httpOnly Cookie（access_token + refresh_token）
- 前端通过 Next.js rewrites 代理 API（同源策略，Cookie 自动携带）
- Zustand 管理客户端认证状态，`restore()` 通过 `/api/v1/users/me` 恢复
- 401 时自动尝试 refresh，失败跳转登录页
- SSR 阶段为未认证状态，客户端 hydration 后恢复（~2s）

---

## 8. Category System | 品类体系

| key | 中文 | 子类数 | 页面布局 |
|-----|------|--------|---------|
| dining | 餐饮 | 10 | 暖色调杂志风 |
| leisure | 游乐 | 8 | 翠绿活力风 |
| media | 影音 | 5 | 深色沉浸式 |
| other | 器物 | 10 | 工业极简风 |
| free | 随谈 | 4 | 轻社区风 |
