"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ResonanceCardProps {
  avgScore: number | null | undefined;
  scoreCount: number;
  scoreError: boolean;
  isAuthenticated: boolean;
  canScore: boolean;
  canPost: boolean;
  effectiveLevel: number;
  myResonance: number;
  onResonance: (level: number) => void;
  isSubmitting: boolean;
  submitError: boolean;
  postId: string;
}

export function ResonanceCard({
  avgScore,
  scoreCount,
  scoreError,
  isAuthenticated,
  canScore,
  canPost,
  myResonance,
  onResonance,
  isSubmitting,
  submitError,
  postId,
}: ResonanceCardProps) {
  return (
    <Card className="sticky top-20 overflow-hidden rounded-2xl border-border shadow-sm">
      <CardContent className="p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">共鸣</p>

        {/* 聚合分数 */}
        <div className="mt-3">
          <p className="font-display text-3xl font-bold tabular-nums text-foreground">
            {scoreError ? "-" : avgScore != null ? (avgScore / 10).toFixed(1) : "-"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {scoreError ? "加载失败" : scoreCount > 0 ? `${scoreCount} 人产生共鸣` : "暂无共鸣"}
          </p>
        </div>

        {/* 刻度轨 */}
        <div className="mt-4 px-1">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-[10px] right-[10px] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-100" />
            {avgScore != null && scoreCount > 0 && (
              <div
                className="absolute left-[10px] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-amber-400 transition-all"
                style={{ width: `calc(${(avgScore / 10 - 1) / 9 * 100}% - 20px)` }}
              />
            )}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
              const avgLevel = avgScore != null ? Math.round(avgScore / 10) : 0;
              const isAvg = scoreCount > 0 && level === avgLevel;
              const isMine = myResonance === level;
              return (
                <div key={level} className="relative flex flex-col items-center" style={{ width: `${100 / 10}%` }}>
                  <div
                    className={`h-3 w-3 rounded-full transition-all ${
                      isMine ? "bg-primary ring-4 ring-primary/20 scale-125"
                        : isAvg ? "bg-amber-400 ring-2 ring-amber-200"
                        : "bg-slate-200"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>有启发</span>
            <span>深度共鸣</span>
          </div>
        </div>

        {/* 我的共鸣 */}
        {isAuthenticated && canScore && (
          <div className="mt-5 border-t border-border pt-5">
            <p className="mb-3 text-xs font-medium text-foreground">
              {myResonance > 0 ? `我的共鸣 · ${myResonance}` : "点击下方表达共鸣"}
            </p>
            <div className="relative flex items-center justify-between px-[2px]">
              <div className="absolute left-[4px] right-[4px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
              {myResonance > 0 && (
                <div
                  className="absolute left-[4px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary/60 transition-all"
                  style={{ width: `calc(${(myResonance - 1) / 9 * 100}% - 4px)` }}
                />
              )}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onResonance(level)}
                  disabled={isSubmitting}
                  title={`共鸣 ${level}`}
                  className={`relative z-10 h-6 w-6 rounded-full text-[10px] font-semibold transition-all flex items-center justify-center ${
                    myResonance === level
                      ? "bg-primary text-white shadow-md scale-110"
                      : "bg-white border border-slate-200 text-slate-400 hover:border-primary/40 hover:text-slate-600"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            {submitError && <p className="mt-2 text-xs text-danger">提交失败，请重试</p>}
          </div>
        )}

        {isAuthenticated && !canScore && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">完成实名认证 (L2) 后可表达共鸣</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-5 border-t border-border pt-4">
            <Link href={`${ROUTES.LOGIN}&redirect=${encodeURIComponent(`/posts/${postId}`)}`} className="text-xs text-primary hover:underline">
              登录后表达共鸣
            </Link>
          </div>
        )}

        {isAuthenticated && canPost && (
          <Link href={ROUTES.POST_NEW}>
            <Button className="mt-4 w-full rounded-xl gap-1.5">
              <PenLine className="h-4 w-4" /> 发布帖子
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
