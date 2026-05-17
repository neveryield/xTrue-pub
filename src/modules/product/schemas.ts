/**
 * 帖子模块 - TypeScript 类型定义
 *
 * 后端路由已从 products 改名为 posts。
 */

/** 帖子（对应后端 PostResponse） */
export interface Post {
  post_id: string;
  category: string;
  subcategory: string;
  author_id: string;
  title: string | null;
  content: string | null;
  images?: string[];
  visibility: string;
  moderation_status: number;
  authenticity_ack: boolean;
  created_at: string;
  updated_at: string;
  score_avg: number | null;
  score_count: number;
}

/** 帖子列表 */
export interface PostList {
  items: Post[];
  total: number;
  offset: number;
  limit: number;
}

/** @deprecated 旧产品类型，逐步迁移到 Post */
export interface Product {
  product_id: number;
  name: string;
  category: string;
  description: string | null;
  cover_url: string | null;
  published_at: string | null;
  status: number;
  created_at: string;
  weighted_score: number | null;
  review_count: number;
}

/** @deprecated 旧产品列表类型 */
export interface ProductList {
  items: Product[];
  total: number;
  offset: number;
  limit: number;
}
