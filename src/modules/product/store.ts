/**
 * Product 模块状态管理 — 筛选条件、分页状态、视图模式
 */

import { create } from "zustand";

export type ViewMode = "grid" | "table";
export type SortOption = "default" | "rating" | "reviews" | "newest";
export type CategoryFilter = "all" | "movie" | "food" | "product";

interface ProductState {
  /** 分类筛选 */
  category: CategoryFilter;
  setCategory: (category: CategoryFilter) => void;

  /** 搜索关键词 */
  keyword: string;
  setKeyword: (keyword: string) => void;

  /** 排序方式 */
  sort: SortOption;
  setSort: (sort: SortOption) => void;

  /** 当前页码（从 1 开始） */
  page: number;
  setPage: (page: number) => void;

  /** 每页数量 */
  pageSize: number;

  /** 视图模式 */
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  /** 重置为默认值 */
  reset: () => void;
}

const defaults = {
  category: "all" as CategoryFilter,
  keyword: "",
  sort: "default" as SortOption,
  page: 1,
  pageSize: 20,
  viewMode: "grid" as ViewMode,
};

export const useProductStore = create<ProductState>((set) => ({
  ...defaults,

  setCategory: (category) => set({ category, page: 1 }),
  setKeyword: (keyword) => set({ keyword, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  setViewMode: (viewMode) => set({ viewMode }),

  reset: () => set(defaults),
}));
