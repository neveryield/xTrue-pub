/**
 * 首页 — Editorial Flux
 * Hero → 精选杂志布局 → 搜索 → 不规则Bento网格 → 统计条 → CTA
 */

"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/modules/product/hooks";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HomeHero } from "./home_hero";
import { HomeSearchBar } from "./home_search_bar";
import { PostCard, PostCardSpotlight, PostCardFeatured, PostCardCompact } from "./home_post_card";
import { HomePagination } from "./home_pagination";
import { HomeStatsBar } from "./home_stats_bar";
import { HomeCTA } from "./home_cta";
import { HomeGridSkeleton, HomeSkeleton } from "./home_skeletons";
import { LeisureLayout, LeisurePostCard } from "./home_leisure";
import { DiningLayout, DiningPostCard } from "./home_dining";
import { FreeLayout, FreePostCard } from "./home_free";
import { MediaLayout, MediaPostCard } from "./home_media";
import { OtherLayout, OtherPostCard } from "./home_other";
import { Loader2, RefreshCw, AlertCircle, Sparkles, Flame, Utensils, Film, Ticket, MessageSquare, ArrowRight, Package } from "lucide-react";

const PAGE_SIZE = 12;

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const keywordFromUrl = searchParams.get("keyword") ?? "";

  const [category, setCategory] = useState(categoryFromUrl);
  const [keyword, setKeyword] = useState(keywordFromUrl);
  const [searchInput, setSearchInput] = useState(keywordFromUrl);
  const [page, setPage] = useState(0);
  const [heroDismissed, setHeroDismissed] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("heroDismissed") === "1";
    return false;
  });

  const dismissHero = useCallback(() => {
    setHeroDismissed(true);
    sessionStorage.setItem("heroDismissed", "1");
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") ?? "";
    const kw = searchParams.get("keyword") ?? "";
    setCategory(cat);
    setKeyword(kw);
    setSearchInput(kw);
    setPage(0);
  }, [searchParams]);

  // 全域流数据
  const { data, isLoading, isError, isFetching, refetch } = useProducts({
    category: category || undefined,
    keyword: keyword || undefined,
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  // 分类精华数据 (仅在首页显示)
  const showHub = !category && !keyword;

  const { data: featuredData } = useProducts({ limit: 6 });
  const { data: diningData } = useProducts({ category: "dining", limit: 3 });
  const { data: mediaData } = useProducts({ category: "media", limit: 4 });
  const { data: leisureData } = useProducts({ category: "leisure", limit: 3 });
  const { data: freeData } = useProducts({ category: "free", limit: 2 });
  const { data: otherData } = useProducts({ category: "other", limit: 3 });

  const posts = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const featuredPosts = (featuredData?.items ?? [])
    .sort((a: any, b: any) => (b.score_avg ?? 0) - (a.score_avg ?? 0))
    .slice(0, 3);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0);
  };

  const handleCategoryChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key) params.set("category", key);
    else params.delete("category");
    params.delete("keyword");
    window.history.pushState(null, "", `/?${params.toString()}`);
    setCategory(key);
    setKeyword("");
    setSearchInput("");
    setPage(0);
  };

  if (category === "leisure") {
    return (
      <LeisureLayout
        keyword={keyword}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    );
  }

  if (category === "dining") {
    return (
      <DiningLayout
        keyword={keyword}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    );
  }

  if (category === "free") {
    return (
      <FreeLayout
        keyword={keyword}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    );
  }

  if (category === "media") {
    return (
      <MediaLayout
        keyword={keyword}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    );
  }

  if (category === "other") {
    return (
      <OtherLayout
        keyword={keyword}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      {/* ════════ Hero ════════ */}
      {!heroDismissed && (
        <HomeHero
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
          totalPosts={total > 0 ? total : undefined}
          onDismiss={dismissHero}
        />
      )}

      <div className="mx-auto max-w-6xl px-5">
      <div className="mb-6 pt-6 text-center">
        <HomeSearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          loading={isFetching}
        />
      </div>

        {showHub && (
          <div className="space-y-12 py-8">
            {/* 1. 精选高光 - 沉浸式杂志展台 */}
            {featuredPosts.length > 0 && (
              <section className="relative">
                {/* 背景装饰元素 */}
                <div className="absolute -left-24 top-0 -z-10 h-64 w-64 rounded-full bg-amber-100/20 blur-3xl" />
                
                <div className="mb-6 flex items-end justify-between">
                  <SectionHeader 
                    icon={<Flame className="text-amber-500" />} 
                    title="精选评价" 
                    subtitle="甄选之作"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                  <div className="md:col-span-2">
                    <PostCardFeatured post={featuredPosts[0]} />
                  </div>
                  <div className="flex flex-col gap-6 lg:gap-8">
                    {featuredPosts.slice(1, 3).map((post: any) => (
                      <PostCardCompact key={post.post_id} post={post} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 2. 饕餮实验室 (Dining) */}
            {diningData?.items && diningData.items.length > 0 && (
              <section>
                <div className="mb-6">
                  <SectionHeader 
                    icon={<Utensils className="text-[#E34D2F]" />} 
                    title="饕餮实验室" 
                    subtitle="味觉漫游"
                    onMore={() => handleCategoryChange("dining")}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {diningData.items.map((post: any, idx: number) => (
                    <DiningPostCard key={post.post_id} post={post} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. 剧场流向 (Media) */}
            {mediaData?.items && mediaData.items.length > 0 && (
              <section className="rounded-[2.5rem] bg-[#0F1115] p-8 text-white md:p-10">
                <div className="mb-8">
                  <SectionHeader 
                    icon={<Film className="text-purple-400" />} 
                    title="剧场流向" 
                    subtitle="光影之旅"
                    onMore={() => handleCategoryChange("media")}
                    dark
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                  {mediaData.items.map((post: any, idx: number) => (
                    <MediaPostCard key={post.post_id} post={post} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. 动感体验 (Leisure) */}
            {leisureData?.items && leisureData.items.length > 0 && (
              <section>
                <div className="mb-6">
                  <SectionHeader 
                    icon={<Ticket className="text-emerald-500" />} 
                    title="动感体验" 
                    subtitle="闲趣时光"
                    onMore={() => handleCategoryChange("leisure")}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {leisureData.items.map((post: any) => (
                    <LeisurePostCard key={post.post_id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* 5. 器物 (Other) */}
            {otherData?.items && otherData.items.length > 0 && (
              <section>
                <div className="mb-6">
                  <SectionHeader 
                    icon={<Package className="text-blue-500" />} 
                    title="器物手帖"
                    subtitle="器物之美"
                    onMore={() => handleCategoryChange("other")}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherData.items.map((post: any, idx: number) => (
                    <OtherPostCard key={post.post_id} post={post} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* 6. 随谈漫话 (Free) */}
            {freeData?.items && freeData.items.length > 0 && (
              <section>
                <div className="mb-6">
                  <SectionHeader 
                    icon={<MessageSquare className="text-zinc-400" />} 
                    title="随谈漫话"
                    subtitle="日常随想"
                    onMore={() => handleCategoryChange("free")}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {freeData.items.map((post: any) => (
                    <FreePostCard key={post.post_id} post={post} />
                  ))}
                </div>
              </section>
            )}

            <div className="border-t border-[#E8E3DA]/60 pt-10">
              <SectionHeader 
                icon={<Sparkles className="text-[#8B8478]" />} 
                title="全域脉动" 
                subtitle="实时脉动"
              />
            </div>
          </div>
        )}

        {/* ════════ 主体流/全域脉动 ════════ */}
        <section className={cn("pb-12 md:pb-16", showHub ? "pt-0" : "pt-6")}>
          {isLoading && <HomeGridSkeleton />}

          {!isLoading && isError && (
            <div className="py-20 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[#D0C9BE]" />
              <p className="text-[15px] text-[#8B8478]">加载失败，请稍后重试</p>
              <Button variant="outline" className="mt-5 rounded-xl gap-1.5 border-[#E8E3DA] text-[#5C554A] hover:bg-[#FBFAF7]"
                onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                重新加载
              </Button>
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className="py-20 text-center">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#D0C9BE]" />
              <p className="text-[15px] text-[#8B8478]">暂无帖子</p>
              <Link href={ROUTES.POST_NEW}>
                <Button className="mt-5 rounded-xl gap-1.5">发布第一篇帖子</Button>
              </Link>
            </div>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any, idx: number) => {
                  if (idx === 0 && !showHub) {
                    return <PostCardSpotlight key={post.post_id} post={post} />;
                  }
                  return <PostCard key={post.post_id} post={post} index={idx} />;
                })}
              </div>
              <HomePagination page={page} totalPages={totalPages} loading={isFetching} onChange={setPage} />
            </>
          )}
        </section>
      </div>

      <HomeStatsBar />
      <HomeCTA />
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, onMore, dark }: { icon: React.ReactNode, title: string, subtitle?: string, onMore?: () => void, dark?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl shadow-sm", dark ? "bg-white/10" : "bg-white border border-[#E8E3DA]/60")}>
          {icon}
        </div>
        <div>
          <h2 className={cn("text-xl font-black tracking-tight", dark ? "text-white" : "text-[#1E1B18]")}>{title}</h2>
          {subtitle && (
            <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", dark ? "text-white/40" : "text-[#B8B0A4]")}>{subtitle}</p>
          )}
        </div>
      </div>
      {onMore && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMore}
          className={cn("text-[13px] font-bold transition-all", dark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-[#8B8478] hover:text-amber-600 hover:bg-amber-50/50") }
        >
          查看更多
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
