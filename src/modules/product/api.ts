/**
 * 帖子模块 - API 调用封装
 *
 * 后端路由命名已从 products 改为 posts；本模块文件名暂保留 product 兼容现有引用。
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type { Post, PostList } from "./schemas";

export async function getPosts(params?: {
  category?: string;
  subcategory?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}): Promise<PostList> {
  return api.get<PostList>(API.POSTS.LIST, false, params as Record<string, string | number>);
}

export async function getPostDetail(postId: string): Promise<Post> {
  return api.get<Post>(API.POSTS.DETAIL(postId));
}

export async function createPost(data: {
  category: string;
  subcategory: string;
  content: string;
  title?: string;
  images?: string[];
  authenticity_ack: boolean;
}): Promise<Post> {
  return api.post<Post>(API.POSTS.CREATE, data, true);
}

export async function updatePost(
  postId: string,
  data: { title?: string; content?: string; category?: string; subcategory?: string },
): Promise<Post> {
  return api.put<Post>(API.POSTS.UPDATE(postId), data, true);
}

export async function deletePost(postId: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(API.POSTS.DELETE(postId), true);
}
