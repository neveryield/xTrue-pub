/**
 * 随谈 (Free) 品类布局 — 轻社区漫话
 * 针对短文本、树洞、投票等内容优化的布局
 */

"use client";

import React from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Ghost, 
  Sparkles,
  TrendingUp,
  Search,
  PlusCircle,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { HomeSearchBar } from "./home_search_bar";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FreeLayoutProps {
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

export function FreeLayout(props: FreeLayoutProps) {
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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 1. 极简 Hero */}
      <section className="bg-white border-b border-zinc-100 py-8 md:py-12 lg:h-[35vh] flex flex-col justify-center">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight md:text-4xl">随谈漫话</h1>
          <p className="mt-2 text-zinc-500 text-sm md:text-base">让思想自由流动，让真实被听见。</p>
          
          <div className="mt-6 mx-auto max-w-xl">
             <HomeSearchBar
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearch}
                loading={isFetching}
              />
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link href={ROUTES.POST_NEW + "?category=free&subcategory=tree_hole"}>
              <Button variant="outline" className="rounded-full px-6 h-11 border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                <Ghost className="mr-2 h-4 w-4" /> 发个树洞
              </Button>
            </Link>
            <Link href={ROUTES.POST_NEW + "?category=free"}>
              <Button className="rounded-full px-6 h-11 bg-zinc-900 text-white hover:bg-zinc-800">
                <PlusCircle className="mr-2 h-4 w-4" /> 发起讨论
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* 2. 热门话题预览 */}
        {!keyword && page === 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">热门话题</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {["#深夜树洞", "#我的年度总结", "#投票: 下午茶吃什么", "#那些瞬间"].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => { setSearchInput(tag.replace('#', '')); handleSearch(); }}
                  className="shrink-0 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. 内容流 */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              {keyword ? `搜索: ${keyword}` : "最新动态"}
            </h2>
            {isFetching && <Sparkles className="h-4 w-4 text-zinc-300 animate-pulse" />}
          </div>

          {isLoading ? (
            <div className="space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-48 bg-white border border-zinc-100 rounded-3xl animate-pulse" />
               ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-6">
                {posts.map((post) => (
                  <FreePostCard key={post.post_id} post={post} />
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
              <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-zinc-500">空空如也，来做第一个发言的人吧</p>
              <Link href={ROUTES.POST_NEW + "?category=free"}>
                <Button className="mt-6 rounded-full bg-zinc-900">立即发布</Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <HomeStatsBar />
      <HomeCTA />
    </div>
  );
}

export function FreePostCard({ post }: { post: any }) {
  const isTreeHole = post.subcategory === 'tree_hole';
  // 简化的 HTML 剥离，仅用于判断长度
  const plainText = (post.content || "").replace(/<[^>]*>/g, "").trim();
  const isShort = plainText.length < 80;

  return (
    <Link 
      href={ROUTES.POST_DETAIL(post.post_id)}
      className={cn(
        "group block rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl",
        isTreeHole 
          ? "bg-zinc-900 text-zinc-100 hover:shadow-zinc-900/20" 
          : "bg-white border border-zinc-100 text-zinc-900 hover:shadow-zinc-200/50"
      )}
    >
      {/* 头部：类型标识 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            isTreeHole ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-600"
          )}>
            {isTreeHole ? <Ghost className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
            {isTreeHole ? "隐藏的树洞" : "公开讨论"}
          </span>
        </div>
        <ScoreRing score={post.score_avg || 0} size="sm" showValue={!isTreeHole} />
      </div>

      {/* 正文：动态字号 */}
      <div className={cn(
        "font-display leading-[1.4] transition-colors",
        isShort ? "text-2xl md:text-3xl font-medium tracking-tight" : "text-lg md:text-xl opacity-90",
        !isTreeHole && "group-hover:text-zinc-600"
      )}>
        {plainText}
      </div>

      {/* 底部：互动 */}
      <div className={cn(
        "mt-10 flex items-center justify-between border-t pt-8",
        isTreeHole ? "border-white/10" : "border-zinc-100"
      )}>
        <div className="flex gap-6">
           <div className="flex items-center gap-2 text-sm opacity-50 group-hover:opacity-100 transition-opacity">
             <MessageSquare className="h-4 w-4" />
             <span className="font-bold tabular-nums">{post.score_count || 0}</span>
           </div>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest opacity-30">
          {post.created_at ? new Date(post.created_at).toLocaleDateString() : '刚刚'}
        </div>
      </div>
    </Link>
  );
}
