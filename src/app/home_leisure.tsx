/**
 * 游乐 (Leisure) 品类布局 — Dynamic Experience Guide
 * 针对主题乐园、桌游、演唱会、展览等内容优化的活力布局
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Loader2, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Ticket,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { ROUTES, SUBCATEGORIES } from "@/lib/constants";
import { useProducts } from "@/modules/product/hooks";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { LeisureMasonrySkeleton } from "./home_skeletons";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const LEISURE_HOT_LIMIT = 6;

/** 子类进度条固定占比（模拟数据，待接入真实统计） */
const LEISURE_SUB_PROGRESS: Record<string, number> = {
  theme_park: 82,
  board_game: 68,
  escape_room: 75,
  concert: 91,
  exhibition: 64,
  esports: 57,
  travel: 88,
  hotel: 73,
};

export interface LeisureLayoutProps {
  keyword: string;
  searchInput: string;
  setSearchInput: (v: string) => void;
  handleSearch: () => void;
  posts: any[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
  page: number;
  setPage: (v: number | ((p: number) => number)) => void;
  totalPages: number;
}

export function LeisureLayout({
  keyword,
  searchInput,
  setSearchInput,
  handleSearch,
  posts,
  isLoading,
  isError,
  isFetching,
  refetch,
  page,
  setPage,
  totalPages,
}: LeisureLayoutProps) {
  const [selectedSub, setSelectedSub] = useState<string>("");

  const { data: subData, isLoading: subLoading } = useProducts({
    category: "leisure",
    subcategory: selectedSub || undefined,
    keyword: keyword || undefined,
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  const { data: hotData } = useProducts({
    category: "leisure",
    limit: LEISURE_HOT_LIMIT,
  });

  const displayPosts = selectedSub ? (subData?.items ?? []) : posts;
  const displayTotalPages = selectedSub ? (subData ? Math.ceil(subData.total / PAGE_SIZE) : 0) : totalPages;
  const hotPosts = hotData?.items ?? [];
  const leisureSubs = SUBCATEGORIES.leisure ?? [];

  return (
    <div className="min-h-screen bg-[#FDFDFA] text-[#1A2E25]">
      {/* 1. Playful Hero Section */}
      <section className="relative overflow-hidden bg-[#E7F3ED] py-8 md:py-12 lg:h-[35vh] flex flex-col justify-center">
        {/* Abstract background shapes */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-yellow-200/30 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-5 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="md:max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-600 shadow-sm">
                <Compass className="h-3 w-3" />
                <span>不负好时光，探寻新奇趣</span>
              </div>
              <h1 className="font-display text-2xl font-black tracking-tight text-[#0C5C38] md:text-4xl lg:text-5xl">
                让每一次 <span className="text-emerald-500">出发</span> 都充满期待
              </h1>
              <p className="mt-3 text-sm text-emerald-800/70 md:text-base">
                无论是乐园狂欢还是文艺展览，这里都有最真实的一手测评，助你避坑踩雷。
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type="text"
                    placeholder="搜索乐园、展览、演唱会..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 w-full rounded-2xl bg-white pl-12 pr-4 text-base shadow-sm outline-none ring-2 ring-transparent transition-all focus:ring-emerald-500/20"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isFetching}
                  className="h-14 rounded-2xl bg-[#0C5C38] px-8 text-base font-bold text-white hover:bg-[#0C5C38]/90 shadow-lg shadow-emerald-900/10"
                >
                  开始探索
                </Button>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="hidden lg:block shrink-0">
               <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Ticket className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#0C5C38]">2.4k+</div>
                      <div className="text-[10px] font-bold text-emerald-600/50 tracking-wider">探店足迹</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leisureSubs.slice(0, 3).map(s => (
                      <div key={s.key} className="flex items-center justify-between text-sm font-bold">
                        <span className="text-emerald-800/60">{s.label}</span>
                        <div className="h-1.5 w-24 rounded-full bg-emerald-50 overflow-hidden">
                           <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${LEISURE_SUB_PROGRESS[s.key] ?? 60}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        {/* 2. Experience Categories */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">探索分类</h2>
              <p className="text-sm text-emerald-800/50">按兴趣发现你的下一次精彩</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {leisureSubs.map((sub) => (
              <button
                key={sub.key}
                onClick={() => { setSelectedSub(sub.key); setPage(0); }}
                className={cn(
                  "group flex flex-col items-center gap-3 rounded-[1.5rem] p-4 transition-all duration-300",
                  selectedSub === sub.key 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "bg-white border border-emerald-50 text-emerald-800 hover:border-emerald-200 hover:shadow-md"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                  selectedSub === sub.key ? "bg-white/20" : "bg-emerald-50 group-hover:bg-emerald-100"
                )}>
                  {getLeisureIcon(sub.key)}
                </div>
                <span className="text-xs font-bold">{sub.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Hot Recommendations (only on main page) */}
        {!selectedSub && !keyword && hotPosts.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0C5C38]">本周最热体验</h2>
                <p className="text-sm text-emerald-800/50">大家都在打卡的宝藏去处</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotPosts.slice(0, 3).map((post) => (
                <LeisurePostCard key={post.post_id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* 4. Experience Feed */}
        <section>
          <div className="mb-10 flex items-center justify-between border-b border-emerald-50 pb-6">
             <h2 className="text-2xl font-bold tracking-tight text-[#0C5C38]">
               {selectedSub ? `“${leisureSubs.find(s => s.key === selectedSub)?.label}” 深度评测` : "发现更多玩乐"}
             </h2>
             {selectedSub && (
                <button 
                  onClick={() => setSelectedSub("")}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  清除筛选 <RefreshCw className="h-3.5 w-3.5" />
                </button>
             )}
          </div>

          {(isLoading || subLoading) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="h-80 rounded-3xl bg-emerald-50 animate-pulse" />
               ))}
            </div>
          ) : displayPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <LeisurePostCard key={post.post_id} post={post} />
                ))}
              </div>
              <div className="mt-16">
                <HomePagination 
                  page={page} 
                  totalPages={displayTotalPages} 
                  loading={isFetching} 
                  onChange={setPage} 
                  variant="pill"
                />
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
               <div className="mx-auto h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <Compass className="h-10 w-10 text-emerald-200" />
               </div>
               <p className="text-emerald-800/50 font-medium">这里还没有脚印，快来分享你的探店经历吧！</p>
               <Link href={ROUTES.POST_NEW + "?category=leisure"}>
                 <Button className="mt-8 rounded-2xl bg-emerald-600">发布评测</Button>
               </Link>
            </div>
          )}
        </section>
      </div>

      <HomeStatsBar variant="leisure" />
      <HomeCTA variant="leisure" />
    </div>
  );
}

function getLeisureIcon(key: string) {
  switch (key) {
    case 'theme_park': return '🎢';
    case 'board_game': return '🎲';
    case 'escape_room': return '🔑';
    case 'concert': return '🎤';
    case 'exhibition': return '🖼️';
    case 'esports': return '🎮';
    case 'travel': return '🗺️';
    case 'hotel': return '🏨';
    default: return '🎈';
  }
}

export function LeisurePostCard({ post, featured }: { post: any; featured?: boolean }) {
  const score = Math.round(post.score_avg ?? 0);
  
  return (
    <Link 
      href={ROUTES.POST_DETAIL(post.post_id)}
      className={cn(
        "group block relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500",
        featured ? "shadow-xl shadow-emerald-900/5 hover:scale-[1.02]" : "border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5"
      )}
    >
      {/* Image Wrap */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {post.images?.[0] ? (
          <img 
            src={post.images[0]} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50">
             <Compass className="h-12 w-12 text-emerald-200" />
          </div>
        )}
        
        {/* Score Badge */}
        <div className="absolute right-5 top-5 h-14 w-14 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg flex flex-col items-center justify-center transition-transform group-hover:rotate-12">
           <span className="text-[10px] font-bold text-emerald-800/50 leading-none">评分</span>
           <span className="text-xl font-black text-emerald-600 leading-tight">{score}</span>
        </div>

        {/* Subcategory */}
        {post.subcategory_label && (
           <div className="absolute left-5 bottom-5 rounded-full bg-emerald-900/40 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              {post.subcategory_label}
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="line-clamp-2 text-xl font-bold text-[#1A2E25] group-hover:text-emerald-600 transition-colors duration-300 leading-snug">
          {post.title || "(无标题)"}
        </h3>
        
        <p className="mt-4 line-clamp-2 text-sm text-emerald-800/60 leading-relaxed">
          {post.content_preview || post.content?.replace(/<[^>]*>/g, "")}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-emerald-50 pt-6">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-black">
                {String(post.author_id || '?').charAt(0).toUpperCase()}
             </div>
             <span className="text-xs font-bold text-emerald-800/40">已验证体验</span>
           </div>
           
           <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>查看评测</span>
              <ArrowRight className="h-3.5 w-3.5" />
           </div>
        </div>
      </div>
    </Link>
  );
}
