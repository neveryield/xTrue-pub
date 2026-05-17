/**
 * 用户主页 — Warm Breeze 暖风风格
 * 头像 + 信息 + 信誉分环 + 统计卡片
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserProfile, useUserPosts, useAddSubscription, useRemoveSubscription } from "@/modules/user/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES, USER_LEVEL } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { Loader2, User, Star, ThumbsUp, CheckCircle, TrendingUp, ShieldCheck, Award, AlertCircle } from "lucide-react";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const { data: profile, isLoading, isError } = useUserProfile(userId);
  const { data: userPostsData } = useUserPosts(userId);
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const isSelf = isAuthenticated && currentUser?.userId === Number(userId);
  const [subscribed, setSubscribed] = useState(false);
  const addSub = useAddSubscription();
  const removeSub = useRemoveSubscription();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {isError ? <AlertCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" /> : <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />}
        <p className="text-muted-foreground">{isError ? "加载失败，请稍后重试" : "用户不存在"}</p>
      </div>
    );
  }

  const statusLabel = profile.status === 1 ? "正常" : profile.status === 2 ? "警告" : "封禁";
  const statusVariant = profile.status === 1 ? "default" as const : profile.status === 2 ? "warning" as const : "danger" as const;
  const credibilityPct = Math.min((profile.credibility / 2.0) * 100, 100);
  const levelInfo = USER_LEVEL[(profile.user_level ?? 0) as keyof typeof USER_LEVEL];

  const levelGradient = (level: number) => {
    if (level === 5) return { from: "hsl(35,93%,47%)", to: "hsl(28,100%,65%)" };
    if (level === 4) return { from: "hsl(6,78%,62%)", to: "hsl(340,70%,65%)" };
    if (level === 3) return { from: "hsl(200,75%,55%)", to: "hsl(160,65%,45%)" };
    return { from: "hsl(220,70%,60%)", to: "hsl(200,75%,55%)" };
  };

  const gradient = levelGradient(profile.user_level ?? 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-6">
      {/* 用户档案卡片 */}
      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        {/* 等级渐变顶条 */}
        <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }} />
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {/* 头像 — 渐变背景 */}
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            >
              {(profile.nickname || `U`).charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-display text-xl font-bold text-foreground">
                  {profile.nickname || `用户${profile.user_id}`}
                </h1>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
                {levelInfo && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary font-semibold"
                  >
                    <Award className="mr-1 h-3 w-3" /> {levelInfo.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                注册于 {new Date(profile.registered_at).toLocaleDateString("zh-CN")}
              </p>
              {levelInfo && (
                <p className="text-xs text-muted-foreground">{levelInfo.description}</p>
              )}
            </div>

            {/* 信誉分环 */}
            <div className="flex flex-col items-center">
              <ScoreRing
                score={Math.round(credibilityPct)}
                size="lg"
                showValue
              />
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">信誉分</p>
            </div>
          </div>

          {/* 自己看到认证入口 */}
          {isSelf && (profile.user_level ?? 0) < 5 && (
            <div className="mt-5 flex justify-center sm:justify-start border-t border-border pt-5">
              <Link href={ROUTES.CERTIFICATION}>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> 提升认证等级
                </Button>
              </Link>
            </div>
          )}

          {/* 他人看到订阅按钮 */}
          {!isSelf && isAuthenticated && (
            <div className="mt-5 flex justify-center sm:justify-start border-t border-border pt-5">
              {subscribed ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-muted-foreground"
                  disabled={removeSub.isPending}
                  onClick={() => { removeSub.mutate(userId); setSubscribed(false); }}
                >
                  {removeSub.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "已订阅"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="rounded-xl gap-1.5"
                  disabled={addSub.isPending}
                  onClick={() => { addSub.mutate(userId); setSubscribed(true); }}
                >
                  {addSub.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
                  订阅
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Star, label: "发帖", value: userPostsData?.total ?? "-", color: "#f59e0b" },
          { icon: CheckCircle, label: "已验证", value: "-", color: "#10b981" },
          { icon: TrendingUp, label: "平均认同度", value: "-", color: "#3b82f6" },
          { icon: ThumbsUp, label: "获赞", value: "-", color: "#8b5cf6" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="rounded-xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${color}15` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <span className="font-display text-xl font-bold text-foreground">{value}</span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 占位提示 */}
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <Star className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">评价与发帖历史功能即将上线</p>
      </div>
    </div>
  );
}
