/**
 * 我的收藏 — Warm Breeze 暖风风格
 */

"use client";

import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";
import { useFavorites, useRemoveFavorite } from "@/modules/user/hooks";
import { ROUTES, CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Heart, User, MessageCircle, X, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;
const catColorMap: Record<string, { bg: string; text: string }> = {
  dining:   { bg: "hsl(25,85%,92%)",  text: "hsl(25,70%,35%)" },
  leisure:  { bg: "hsl(160,65%,92%)", text: "hsl(160,60%,28%)" },
  media:    { bg: "hsl(280,65%,92%)", text: "hsl(280,50%,38%)" },
  other:    { bg: "hsl(200,75%,92%)", text: "hsl(200,60%,35%)" },
  free:     { bg: "hsl(340,65%,92%)", text: "hsl(340,55%,35%)" },
};

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useFavorites(page * PAGE_SIZE, PAGE_SIZE);
  const removeFavorite = useRemoveFavorite();
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <User className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h2 className="font-display text-xl font-semibold">请先登录</h2>
        <Link href={ROUTES.LOGIN}><Button className="rounded-xl">去登录</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Link href="/users/me" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> 返回档案
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
          <Heart className="h-5 w-5 text-rose-500" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">我的收藏</h1>
          <p className="text-xs text-muted-foreground">收藏的帖子</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-white py-12 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-muted-foreground">加载失败</p>
          <Button variant="outline" className="mt-4 rounded-xl gap-1.5" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" /> 重试
          </Button>
        </div>
      ) : data && data.items && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((item: any) => {
            const colors = catColorMap[item.category] || catColorMap.other;
            const catInfo = CATEGORIES.find(c => c.key === item.category);
            const postId = item.post_id || item.id;
            return (
              <div key={postId} className="group relative">
                <Link href={ROUTES.POST_DETAIL(postId)} className="block no-underline">
                  <Card className="rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        {/* 品类标签 */}
                        {catInfo && (
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mb-1.5"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {catInfo.icon} {catInfo.label}
                          </span>
                        )}
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title || item.content_preview || `帖子 ${postId}`}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {item.score_count ?? 0}</span>
                          {item.created_at && (
                            <span>{new Date(item.created_at).toLocaleDateString("zh-CN")}</span>
                          )}
                        </div>
                      </div>
                      <ScoreRing score={item.score_avg ?? 0} size="sm" showValue />
                    </CardContent>
                  </Card>
                </Link>
                <button
                  type="button"
                  disabled={removingId === postId}
                  onClick={() => {
                    setRemovingId(postId);
                    removeFavorite.mutate(String(postId), { onSettled: () => setRemovingId(null) });
                  }}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-muted-foreground opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100 disabled:opacity-100"
                  title="取消收藏"
                >
                  {removingId === postId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}

          {data.total > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
              <span className="text-sm text-muted-foreground">{page + 1} / {Math.ceil(data.total / PAGE_SIZE)}</span>
              <Button variant="outline" size="sm" className="rounded-xl" disabled={(page + 1) * PAGE_SIZE >= data.total} onClick={() => setPage(page + 1)}>下一页</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white py-12 text-center">
          <Heart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-muted-foreground">暂无收藏</p>
          <Link href={ROUTES.HOME}><Button variant="outline" className="mt-4 rounded-xl">去发现帖子</Button></Link>
        </div>
      )}
    </div>
  );
}
