/**
 * 打分历史 — Warm Breeze 暖风风格
 */

"use client";

import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";
import { useScoreHistory } from "@/modules/user/hooks";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ChevronLeft, TrendingUp, User, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

export default function ScoreHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useScoreHistory(page * PAGE_SIZE, PAGE_SIZE);

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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">打分历史</h1>
          <p className="text-xs text-muted-foreground">你给帖子的认同度打分记录</p>
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
          {data.items.map((item: any) => (
            <Link key={item.post_id || item.id} href={ROUTES.POST_DETAIL(item.post_id || item.id)} className="block no-underline">
              <Card className="rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{item.post_title || `帖子 ${item.post_id}`}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("zh-CN") : ""}
                    </p>
                  </div>
                  <ScoreRing score={item.score ?? 0} size="sm" showValue />
                </CardContent>
              </Card>
            </Link>
          ))}

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
          <TrendingUp className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-muted-foreground">暂无打分记录</p>
          <Link href={ROUTES.HOME}><Button variant="outline" className="mt-4 rounded-xl">去发现帖子</Button></Link>
        </div>
      )}
    </div>
  );
}
