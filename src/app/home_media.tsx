/**
 * 影音 (Media) 品类布局 — Cinematic Streaming Layout
 * 针对电影、电视剧、音乐、视频内容优化的沉浸式布局
 */

"use client";

import React from "react";
import Link from "next/link";
import { 
  Film, 
  Tv, 
  Music, 
  Play, 
  Star, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { HomeSearchBar } from "./home_search_bar";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { ROUTES, SUBCATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MediaLayoutProps {
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

export function MediaLayout(props: MediaLayoutProps) {
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

  const subcategories = SUBCATEGORIES.media;

  return (
    <div className="min-h-screen bg-[#0F1115] text-zinc-100">
      {/* 1. Cinematic Hero */}
      <section className="relative py-8 md:py-12 lg:h-[35vh] overflow-hidden flex flex-col justify-center">
        {/* 背景装饰：流光溢彩 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] bg-purple-600/20 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-[10%] h-[50%] w-[50%] bg-blue-600/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center">
          <div className="mb-3 flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 backdrop-blur-xl border border-white/10">
            <TrendingUp className="h-3 w-3 text-purple-400" />
            <span>影音新动态</span>
          </div>
          
          <h1 className="mb-4 font-display text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            探索 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">银幕之外</span> 的真实
          </h1>
          
          <p className="mb-6 max-w-2xl text-sm text-zinc-400 md:text-base">
            拒绝云评价。来自真实观众、听众与玩家的硬核评分，每一份感悟都值得被铭记。
          </p>
          
          <div className="w-full max-w-2xl">
            <HomeSearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              loading={isFetching}
            />
          </div>
        </div>

        {/* 底部遮罩 */}
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-[#0F1115] to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-20">
        {/* 2. 分类快速切换 */}
        <div className="mb-12 flex items-center justify-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          {subcategories.map((sub) => (
            <button
              key={sub.key}
              onClick={() => { setSearchInput(sub.label); handleSearch(); }}
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/5 px-6 py-3 border border-white/5 transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
            >
              <span className="text-xl">{getMediaIcon(sub.key)}</span>
              <span className="text-sm font-bold tracking-wide">{sub.label}</span>
            </button>
          ))}
        </div>

        {/* 3. 剧场式评价列表 */}
        <section>
          <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {keyword ? `关于“${keyword}”的影评` : "最新评价"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">发现更多高质量的深层解读</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                 <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
               ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {posts.map((post, idx) => (
                  <MediaPostCard key={post.post_id} post={post} index={idx} />
                ))}
              </div>
              <div className="mt-16">
                <HomePagination 
                  page={page} 
                  totalPages={totalPages} 
                  loading={isFetching} 
                  onChange={setPage} 
                />
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-zinc-600">
                <Play className="h-10 w-10 fill-current" />
              </div>
              <p className="text-zinc-500">暂时没有找到相关影评</p>
            </div>
          )}
        </section>
      </div>

      <HomeStatsBar />
      <HomeCTA variant="media" />
    </div>
  );
}

function getMediaIcon(key: string) {
  switch (key) {
    case 'movie': return '🎬';
    case 'tv_series': return '📺';
    case 'music': return '🎵';
    case 'short_drama': return '📱';
    case 'video': return '📹';
    default: return '🍿';
  }
}

export function MediaPostCard({ post, index }: { post: any; index: number }) {
  const isMusic = post.subcategory === 'music';
  
  return (
    <Link 
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group relative block"
    >
      {/* 海报容器 */}
      <div className={cn(
        "relative overflow-hidden rounded-[2rem] bg-zinc-800 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]",
        isMusic ? "aspect-square" : "aspect-[2/3]"
      )}>
        {post.images?.[0] ? (
          <img 
            src={post.images[0]} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center opacity-20">
             {isMusic ? <Music className="h-12 w-12" /> : <Film className="h-12 w-12" />}
          </div>
        )}

        {/* 顶部评分标签 */}
        <div className="absolute right-4 top-4 z-10">
          <ScoreRing score={post.score_avg || 0} size="sm" showValue />
        </div>

        {/* 底部信息遮罩 */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12">
          <div className="flex items-center gap-2 mb-2">
             <span className="rounded bg-purple-600/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {post.subcategory_label || '影音'}
             </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white group-hover:text-purple-400 transition-colors">
            {post.title || "(无标题)"}
          </h3>
        </div>

        {/* Hover 状态下的详情引导 */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl scale-75 group-hover:scale-100 transition-transform duration-500">
              <ChevronRight className="h-6 w-6" />
           </div>
        </div>
      </div>

      {/* 底部副标题：评分人数 & 时间 */}
      <div className="mt-4 flex items-center justify-between px-2 text-[11px] font-bold tracking-[0.1em] text-zinc-600">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-current text-yellow-500/50" />
          <span>{post.score_count || 0} 人评价</span>
        </div>
        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('zh-CN') : '刚刚'}</span>
      </div>
    </Link>
  );
}
