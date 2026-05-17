/**
 * 器物品类专用布局 — 东方器物美学志
 * 针对电子产品、服饰、消费品设计，强调参数感、硬核评价、冷色调、极简排版
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Cpu, 
  ChevronRight, 
  Star, 
  Tag, 
  ArrowRight,
  ChevronDown,
  Layers,
  Zap,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeSearchBar } from "./home_search_bar";
import { HomeGridSkeleton } from "./home_skeletons";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { SUBCATEGORIES, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OtherLayoutProps {
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

export function OtherLayout(props: OtherLayoutProps) {
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
      {/* 1. 工业感 Hero 区域 */}
      <OtherHero 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
        handleSearch={handleSearch} 
        isFetching={isFetching}
      />

      <div className="mx-auto max-w-6xl px-5 py-6 md:py-10">
        {/* 2. 精简分类导览 */}
        <OtherCategoryBar />

        {/* 3. 帖子列表 */}
        <section className="mt-10">
          <div className="mb-8 flex items-end justify-between border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                {keyword ? `寻觅：${keyword}` : "器物手帖"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 uppercase tracking-widest">以挑剔之心，鉴入怀之物</p>
            </div>
            <div className="hidden items-center gap-4 text-xs font-bold text-zinc-400 md:flex">
              <span>收录：{posts.length}</span>
              <div className="h-4 w-[1px] bg-zinc-200" />
              <span>页：{page + 1}/{totalPages || 1}</span>
            </div>
          </div>

          {isLoading ? (
            <HomeGridSkeleton />
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                  <OtherPostCard key={post.post_id} post={post} index={idx} />
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
              <Package className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
              <p className="text-zinc-500">尚无品鉴，静待你的独到眼光</p>
            </div>
          )}
        </section>
      </div>

      <HomeStatsBar variant="other" />
      <HomeCTA variant="other" />
    </div>
  );
}

function OtherHero({ searchInput, setSearchInput, handleSearch, isFetching }: any) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-8 md:py-12 lg:h-[35vh] flex flex-col justify-center">
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-sm bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            <Zap className="h-3 w-3 fill-current" />
            <span>器物志</span>
          </div>
          
          <h1 className="mb-4 text-2xl font-black tracking-tighter text-white md:text-4xl lg:text-5xl">
            不盲从广告 <span className="text-zinc-500">只信仰</span> 真实的触感
          </h1>
          
          <div className="relative mt-6">
            <div className="flex items-center overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 p-1">
              <Search className="ml-4 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="寻一件心头好…"
                className="w-full bg-transparent px-4 py-3 text-lg text-white placeholder-zinc-600 outline-none"
              />
              <Button 
                onClick={handleSearch}
                disabled={isFetching}
                className="rounded-md bg-white px-8 py-3 text-sm font-black text-black hover:bg-zinc-200"
              >
                探物
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              {["旗舰手机", "机械键盘", "降噪耳机", "复古相机"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => { setSearchInput(tag); handleSearch(); }}
                  className="transition-colors hover:text-white"
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

function OtherCategoryBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const categories = SUBCATEGORIES.other;
  
  return (
    <section className="rounded-xl bg-white border border-zinc-200 p-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        {categories.slice(0, isExpanded ? undefined : 6).map((cat) => (
          <Link
            key={cat.key}
            href={`/?category=other&keyword=${cat.label}`}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950"
          >
            <span className="opacity-50">{getOtherCategoryIcon(cat.key)}</span>
            {cat.label}
          </Link>
        ))}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto flex items-center gap-1 px-4 py-2 text-xs font-black uppercase text-blue-600 hover:opacity-70"
        >
          {isExpanded ? "掩卷" : "展卷"}
          <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
        </button>
      </div>
    </section>
  );
}

function getOtherCategoryIcon(key: string) {
  const icons: Record<string, React.ReactNode> = {
    phone: <Zap className="h-4 w-4" />,
    computer: <Cpu className="h-4 w-4" />,
    audio: <Layers className="h-4 w-4" />,
    camera: <Zap className="h-4 w-4" />,
    home_appliance: <ShieldCheck className="h-4 w-4" />,
    kitchen: <ShieldCheck className="h-4 w-4" />,
    car: <Zap className="h-4 w-4" />,
    sports: <ShoppingBag className="h-4 w-4" />,
    beauty: <Tag className="h-4 w-4" />,
    furniture: <Package className="h-4 w-4" />,
  };
  return icons[key] || <Package className="h-4 w-4" />;
}

export function OtherPostCard({ post, index }: { post: any; index: number }) {
  const score = Math.round(post.score_avg ?? 0);
  
  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group flex flex-col border border-zinc-200 bg-white transition-all hover:border-zinc-900 hover:shadow-2xl"
    >
      {/* 图片区域 */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
        {post.images?.[0] ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="h-full w-full object-cover grayscale-[20%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-8 w-8 text-zinc-300" />
          </div>
        )}
        
        {/* 悬浮分数 */}
        <div className={cn(
          "absolute left-4 top-4 flex flex-col items-center justify-center rounded-sm px-2 py-1 font-black shadow-xl",
          score >= 80 ? "bg-green-500 text-white" : score >= 60 ? "bg-amber-500 text-white" : "bg-zinc-900 text-white"
        )}>
          <span className="text-[8px] leading-none opacity-80">鉴</span>
          <span className="text-lg leading-none">{score}</span>
        </div>
      </div>

      {/* 文本内容 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {post.subcategory_label || "综合"}
          </span>
          <div className="h-[1px] flex-1 bg-zinc-100" />
        </div>
        
        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {post.content_preview || post.content}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
              {String(post.author_id).charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold text-zinc-400">ID:{post.author_id}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-zinc-900" />
        </div>
      </div>
    </Link>
  );
}
