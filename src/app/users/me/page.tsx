/**
 * 我的档案 — Warm Breeze 暖风风格
 * 查看/编辑个人信息，统计数据，快捷入口
 */

"use client";

import Link from "next/link";
import { useMyProfile, useUpdateMyProfile, useDeleteMyAccount } from "@/modules/user/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES, USER_LEVEL } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  Loader2, User, Settings, Star, Heart, TrendingUp, History,
  ShieldCheck, ChevronRight, LogOut, AlertTriangle, PenLine, AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function MyProfilePage() {
  const { isAuthenticated, user, userLevel, effectiveLevel, logout } = useAuthStore();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();
  const deleteAccount = useDeleteMyAccount();

  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <User className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h2 className="font-display text-xl font-semibold">请先登录</h2>
        <Link href={ROUTES.LOGIN}><Button className="rounded-xl">去登录</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.nickname || user?.nickname || `用户${user?.userId}`;
  const currentLevel = profile?.user_level ?? userLevel;
  const levelInfo = USER_LEVEL[currentLevel as keyof typeof USER_LEVEL];
  const credibility = profile?.credibility ?? 0;
  const credibilityPct = Math.min((credibility / 2.0) * 100, 100);

  const handleSave = async () => {
    if (!nickname.trim()) { setEditing(false); return; }
    setSaveError("");
    try { await updateProfile.mutateAsync({ nickname: nickname.trim() }); setEditing(false); } catch (e) { setSaveError((e as Error)?.message || "保存失败"); }
  };

  const links = [
    { href: "/users/me/favorites", icon: Heart, label: "我的收藏", desc: "收藏的帖子" },
    { href: "/users/me/subscriptions", icon: Star, label: "我的订阅", desc: "订阅的用户和动态" },
    { href: "/users/me/scores", icon: TrendingUp, label: "打分历史", desc: "认同度打分记录" },
    { href: ROUTES.CERTIFICATION, icon: ShieldCheck, label: "认证中心", desc: "提升认证等级" },
    { href: ROUTES.POST_NEW, icon: PenLine, label: "发布帖子", desc: "分享真实体验" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12 space-y-6">
      {/* 头部 */}
      <h1 className="font-display text-2xl font-bold tracking-tight">
        <Settings className="mr-2 inline h-6 w-6 text-primary" />
        我的档案
      </h1>

      {/* 个人信息卡 */}
      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, hsl(6,78%,62%), hsl(28,100%,65%))" }} />
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="输入新昵称"
                      maxLength={30}
                      className="flex h-9 w-full max-w-[200px] rounded-xl border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Button size="sm" className="rounded-xl" onClick={handleSave} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "保存"}
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setEditing(false); setSaveError(""); }}>取消</Button>
                  </div>
                  {saveError && (
                    <p className="mt-2 text-xs text-danger">{saveError}</p>
                  )}
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl font-bold">{displayName}</span>
                    <Badge variant={currentLevel >= 5 ? "default" : "outline"} className="text-[10px]">
                      {levelInfo?.shortLabel}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setNickname(displayName); setEditing(true); }}
                    className="mt-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    编辑资料
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ScoreRing score={Math.round(credibilityPct)} size="sm" showValue />
              <span className="text-[11px] text-muted-foreground">信誉</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href} className="group block no-underline">
            <Card className="rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 注销账号 */}
      <Card className="rounded-2xl border-danger/20 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">注销账号</p>
              <p className="text-xs text-muted-foreground">注销后数据无法恢复</p>
            </div>
            {showDelete ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-danger" />
                  输入「确认注销」后点击按钮
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="确认注销"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="h-9 w-32 rounded-xl border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button size="sm" variant="destructive" className="rounded-xl" disabled={deleteAccount.isPending || deleteConfirmText !== "确认注销"}
                    onClick={() => deleteAccount.mutate(undefined)}>
                    {deleteAccount.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "确认注销"}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setShowDelete(false); setDeleteConfirmText(""); }}>取消</Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="rounded-xl text-danger border-danger/20 hover:bg-danger/5"
                onClick={() => setShowDelete(true)}>
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> 注销
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
