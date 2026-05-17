/**
 * 餐饮品类专用布局 — Modern Gourmet Magazine Style
 * 强调感官诱导、暖色调、杂志排版
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Utensils, 
  Search, 
  Quote, 
  ChevronRight, 
  Star, 
  MapPin, 
  Flame,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeSearchBar } from "./home_search_bar";
import { HomeGridSkeleton } from "./home_skeletons";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { SUBCATEGORIES, ROUTES } from "@/lib/constants";
import { useComments } from "@/modules/review/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DiningLayoutProps {
  keyword: string;
  searchInput: string;
  setSearchInput: (val: string) => void;
  handleSearch: () => void;
  posts: any[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}

export function DiningLayout(props: DiningLayoutProps) {
  const {
    keyword,
    searchInput,
    setSearchInput,
    handleSearch,
    posts,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
  } = props;

  // 获取前3个帖子的ID用于展示热门评论
  const postIdsForComments = posts.slice(0, 3).map(p => p.post_id);

  return (
    <div className="min-h-screen bg-[#FDFCF0]/50">
      {/* 1. 沉浸式 Hero 区域 */}
      <DiningHero 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
        handleSearch={handleSearch} 
        isFetching={isFetching}
      />

      <div className="mx-auto max-w-6xl px-5 py-6 md:py-10">
        {/* 2. 视觉菜单分类 */}
        <DiningCategoryGrid />

        {/* 3. 热门评论金句墙 - 仅在第一页且无关键词搜索时展示 */}
        {!keyword && page === 0 && postIdsForComments.length > 0 && (
          <div className="mt-8">
            <DiningHotComments postIds={postIdsForComments} />
          </div>
        )}

        {/* 4. 菜单式帖子列表 */}
        <section className="mt-10">
          <div className="mb-6 flex items-baseline justify-between border-b border-[#E34D2F]/10 pb-4">
            <h2 className="font-display text-2xl font-bold text-[#2D5A27]">
              {keyword ? `“${keyword}” 的探店发现` : "食客精选"}
            </h2>
            <span className="text-sm text-[#8B8478]">共 {posts.length} 篇发现</span>
          </div>

          {isLoading ? (
            <HomeGridSkeleton />
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                  <DiningPostCard key={post.post_id} post={post} index={idx} />
                ))}
              </div>
              <div className="mt-12">
                <HomePagination 
                  page={page} 
                  totalPages={totalPages} 
                  loading={isFetching} 
                  onChange={setPage} 
                />
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <Utensils className="mx-auto mb-4 h-12 w-12 text-[#D0C9BE]" />
              <p className="text-[#8B8478]">还没有发现相关的美味，快来分享你的第一口惊艳吧！</p>
            </div>
          )}
        </section>
      </div>

      <HomeStatsBar variant="dining" />
      <HomeCTA variant="dining" />
    </div>
  );
}

/**
 * 餐饮 Hero 区域 - 优化高度与字体大小
 */
function DiningHero({ searchInput, setSearchInput, handleSearch, isFetching }: any) {
  return (
    <section className="relative overflow-hidden bg-[#2D5A27] py-8 md:py-12 lg:h-[35vh] flex flex-col justify-center">
      {/* 背景装饰 */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E34D2F]/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#FDFCF0]/5 blur-3xl" />
      
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FDFCF0]/10 px-3 py-1 text-xs font-medium text-[#FDFCF0]/80 backdrop-blur-sm">
            <Flame className="h-3 w-3 text-[#E34D2F]" />
            <span>品味真实，记录每一口感动</span>
          </div>
          
          <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-[#FDFCF0] md:text-4xl lg:text-5xl">
            寻觅城市中的 <span className="text-[#E34D2F]">味觉惊喜</span>
          </h1>
          
          <div className="mx-auto w-full max-w-xl">
            <div className="group relative flex items-center rounded-xl bg-white/10 p-1.5 shadow-xl backdrop-blur-md transition-all hover:bg-white/15">
              <Search className="ml-3 h-4 w-4 text-[#FDFCF0]/50" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="今天想吃点什么？"
                className="w-full bg-transparent px-3 py-2 text-base text-white placeholder-[#FDFCF0]/40 outline-none"
              />
              <Button 
                onClick={handleSearch}
                disabled={isFetching}
                className="hidden rounded-lg bg-[#E34D2F] px-6 py-2 text-sm font-bold hover:bg-[#E34D2F]/90 md:flex h-auto"
              >
                探索美味
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#FDFCF0]/60">
              <span className="opacity-70">热门：</span>
              {["精致日料", "社区咖啡", "地道火锅", "宝藏小吃"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => { setSearchInput(tag); handleSearch(); }}
                  className="transition-colors hover:text-[#E34D2F]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 视觉菜单分类 - 支持折叠
 */
function DiningCategoryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const categories = SUBCATEGORIES.dining;
  
  return (
    <section className="border-b border-[#E34D2F]/5 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[#2D5A27]">品类指南</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-[#E34D2F] hover:opacity-80"
        >
          {isExpanded ? "收起" : "展开全部"} 
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/?category=dining&keyword=${cat.label}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-[#E34D2F]/5 bg-white p-4 shadow-sm transition-all hover:border-[#E34D2F]/20 hover:shadow-md"
            >
              <div className="text-xl transition-transform group-hover:scale-110">
                {getCategoryIcon(cat.key)}
              </div>
              <span className="text-sm font-bold text-[#5C554A] group-hover:text-[#E34D2F]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function getCategoryIcon(key: string) {
  const icons: Record<string, string> = {
    hotpot: "🍲",
    barbecue: "🍢",
    buffet: "🍱",
    chinese: "🥡",
    western: "🥩",
    japanese: "🍣",
    korean: "🥘",
    cafe: "☕",
    dessert: "🍰",
    snack: "🌮"
  };
  return icons[key] || "🍽️";
}

/**
 * 热门评论金句墙
 */
function DiningHotComments({ postIds }: { postIds: string[] }) {
  return (
    <section className="rounded-[2rem] bg-[#2D5A27]/5 p-6 md:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E34D2F] text-white">
          <Quote className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2D5A27]">食客金句</h2>
          <p className="text-sm text-[#8B8478]">来自社区的真实味觉共鸣</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {postIds.map((postId) => (
          <DiningHotCommentCard key={postId} postId={postId} />
        ))}
      </div>
    </section>
  );
}

function DiningHotCommentCard({ postId }: { postId: string }) {
  const { data, isLoading } = useComments(postId, { offset: 0, limit: 3 });
  const comments = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-[#E34D2F]/10 bg-white p-6">
        <Skeleton className="mb-4 h-6 w-12" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (comments.length === 0) return null;

  const topComment = comments.reduce(
    (best: any, c: any) => ((c.agree_count ?? 0) > (best.agree_count ?? 0) ? c : best),
    comments[0],
  );

  return (
    <Link
      href={ROUTES.POST_DETAIL(postId)}
      className="group flex flex-col justify-between rounded-3xl border border-transparent bg-white p-7 shadow-sm transition-all hover:border-[#E34D2F]/20 hover:shadow-xl hover:shadow-[#E34D2F]/5"
    >
      <div>
        <div className="mb-4 text-[#E34D2F]/20 transition-colors group-hover:text-[#E34D2F]/40">
          <Quote className="h-8 w-8 fill-current" />
        </div>
        <p className="font-display text-lg font-medium leading-relaxed text-[#2D5A27] line-clamp-4">
          {topComment.content}
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-[#FDFCF0] pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2D5A27] text-[10px] font-bold text-white">
            {String(topComment.author_id).charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[#8B8478]">用户{topComment.author_id}</span>
        </div>
        {topComment.agree_count > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-[#E34D2F]/5 px-2 py-0.5 text-[11px] font-bold text-[#E34D2F]">
            <Flame className="h-3 w-3" /> {topComment.agree_count}
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * 现代菜单式帖子卡片
 */
export function DiningPostCard({ post, index }: { post: any; index: number }) {
  const score = Math.round(post.score_avg ?? 0);
  
  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2D5A27]/10",
        index % 3 === 1 ? "md:translate-y-4" : "" // 交错布局增强节奏感
      )}
    >
      {/* 图片容器 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FDFCF0]">
        {post.images?.[0] ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Utensils className="h-12 w-12 text-[#E8E3DA]" />
          </div>
        )}
        
        {/* 分数标签 */}
        <div className="absolute right-4 top-4 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/90 font-display font-bold shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
          <span className="text-[10px] leading-none text-[#8B8478]">评分</span>
          <span className="text-lg leading-none text-[#E34D2F]">{score}</span>
        </div>
        
        {/* 品类标签 */}
        {post.tags?.[0] && (
          <div className="absolute bottom-4 left-4 rounded-full bg-[#2D5A27]/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            #{post.tags[0]}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold leading-snug text-[#2D5A27] group-hover:text-[#E34D2F] transition-colors">
          {post.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-[#8B8478]">
          {post.content_preview || post.content}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-[#FDFCF0] pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#E34D2F]" />
            <span className="text-xs font-medium text-[#5C554A]">{post.location || "未知地点"}</span>
          </div>
          <div className="flex items-center gap-1 text-[#E34D2F] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
            <span className="text-xs font-bold tracking-wider">查看更多</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
