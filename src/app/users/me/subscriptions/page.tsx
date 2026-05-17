/**
 * 我的订阅 — Warm Breeze 暖风风格
 */

"use client";

import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";
import { useSubscriptions, useSubscriptionPosts, useRemoveSubscription } from "@/modules/user/hooks";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Star, User, MessageCircle, X, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

export default function SubscriptionsPage() {
  const { isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState("users");
  const [usersPage, setUsersPage] = useState(0);
  const [postsPage, setPostsPage] = useState(0);
  const page = tab === "users" ? usersPage : postsPage;
  const setPage = tab === "users" ? setUsersPage : setPostsPage;
  const { data: subsData, isLoading: subsLoading, isError: subsError, refetch: refetchSubs } = useSubscriptions(page * PAGE_SIZE, PAGE_SIZE);
  const { data: postsData, isLoading: postsLoading, isError: postsError, refetch: refetchPosts } = useSubscriptionPosts(page * PAGE_SIZE, PAGE_SIZE);
  const removeSub = useRemoveSubscription();
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Star className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">我的订阅</h1>
          <p className="text-xs text-muted-foreground">订阅的用户和最新动态</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 w-full rounded-xl bg-secondary p-1">
          <TabsTrigger value="users" className="rounded-lg text-sm">订阅用户</TabsTrigger>
          <TabsTrigger value="posts" className="rounded-lg text-sm">订阅动态</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3">
          {subsLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : subsError ? (
            <div className="rounded-2xl border border-border bg-white py-12 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-muted-foreground">加载失败</p>
              <Button variant="outline" className="mt-4 rounded-xl gap-1.5" onClick={() => refetchSubs()}>
                <RefreshCw className="h-4 w-4" /> 重试
              </Button>
            </div>
          ) : subsData && subsData.items && subsData.items.length > 0 ? (
            <>
              {subsData.items.map((item: any) => {
                const uid = item.subscribed_user_id || item.user_id || item.id;
                const name = item.nickname || `用户${uid}`;
                return (
                  <div key={uid} className="group relative">
                    <Link href={ROUTES.USER_PROFILE(uid)} className="block no-underline">
                      <Card className="rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                            {String(name).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{name}</p>
                            {item.user_level != null && <Badge variant="outline" className="mt-0.5 text-[10px]">L{item.user_level}</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <button
                      type="button"
                      disabled={removingId === String(uid)}
                      onClick={() => {
                        setRemovingId(String(uid));
                        removeSub.mutate(String(uid), { onSettled: () => setRemovingId(null) });
                      }}
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-muted-foreground opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100 disabled:opacity-100"
                    >
                      {removingId === String(uid) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                );
              })}
              {subsData.total > PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
                  <span className="text-sm text-muted-foreground">{page + 1} / {Math.ceil(subsData.total / PAGE_SIZE)}</span>
                  <Button variant="outline" size="sm" className="rounded-xl" disabled={(page + 1) * PAGE_SIZE >= subsData.total} onClick={() => setPage(page + 1)}>下一页</Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-white py-12 text-center">
              <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-muted-foreground">暂无订阅用户</p>
              <Link href={ROUTES.HOME}><Button variant="outline" className="mt-4 rounded-xl">去发现用户</Button></Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-3">
          {postsLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
          ) : postsError ? (
            <div className="rounded-2xl border border-border bg-white py-12 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-muted-foreground">加载失败</p>
              <Button variant="outline" className="mt-4 rounded-xl gap-1.5" onClick={() => refetchPosts()}>
                <RefreshCw className="h-4 w-4" /> 重试
              </Button>
            </div>
          ) : postsData && postsData.items && postsData.items.length > 0 ? (
            <>
              {postsData.items.map((item: any) => {
                const pid = item.post_id || item.id;
                return (
                  <Link key={pid} href={ROUTES.POST_DETAIL(pid)} className="block no-underline">
                    <Card className="rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-foreground">{item.title || item.post_title || `帖子 ${pid}`}</p>
                        {item.content && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.content}</p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {item.score_count ?? 0}</span>
                          {item.created_at && <span>{new Date(item.created_at).toLocaleDateString("zh-CN")}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
              {postsData.total > PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
                  <span className="text-sm text-muted-foreground">{page + 1} / {Math.ceil(postsData.total / PAGE_SIZE)}</span>
                  <Button variant="outline" size="sm" className="rounded-xl" disabled={(page + 1) * PAGE_SIZE >= postsData.total} onClick={() => setPage(page + 1)}>下一页</Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-white py-12 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-muted-foreground">暂无订阅动态</p>
              <p className="text-xs text-muted-foreground mt-1">订阅用户发布帖子后会在这里显示</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
