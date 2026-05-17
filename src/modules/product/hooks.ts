/**
 * 产品/帖子模块 - React Query Hooks
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "./api";

export function useProducts(params?: {
  category?: string;
  subcategory?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postApi.getPosts(params),
  });
}

export function useProductDetail(postId: string | null) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.getPostDetail(postId!),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

/** @deprecated 旧接口，使用 useCreatePost */
export function useCreateProduct() {
  return useCreatePost();
}
