/** 评价提交页 — 5星评分映射到认同度 0-100，使用 upsertScore + createComment */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductDetail } from "@/modules/product/hooks";
import { useUpsertScore, useCreateComment } from "@/modules/review/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES, USER_LEVEL, AGREEMENT, CATEGORY_LABELS } from "@/lib/constants";
import { canPost } from "@/modules/auth/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Star, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

/** 5星制：每星映射到 20 分认同度 */
const STAR_COUNT = 5;
const starToScore = (star: number) => star * (AGREEMENT.SCORE_MAX / STAR_COUNT);

export default function ReviewSubmitPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  const router = useRouter();
  const { isAuthenticated, effectiveLevel } = useAuthStore();
  const { data: post, isLoading: postLoading, isError: postError } =
    useProductDetail(postId);
  const upsertScore = useUpsertScore();
  const createComment = useCreateComment();

  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [content, setContent] = useState("");

  const reviewPath = `/products/${postId}/review`;
  const loginWithRedirect = `${ROUTES.LOGIN}&redirect=${encodeURIComponent(reviewPath)}`;

  if (postLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">帖子不存在或加载失败</h2>
        <Link href={ROUTES.HOME}>
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-semibold">请先登录</h2>
        <p className="text-muted-foreground">提交评价需要登录账号</p>
        <Link href={loginWithRedirect}>
          <Button>去登录</Button>
        </Link>
      </div>
    );
  }

  if (!canPost(effectiveLevel)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-semibold">权限不足</h2>
        <p className="text-muted-foreground">
          当前层级为「{USER_LEVEL[effectiveLevel as keyof typeof USER_LEVEL]?.label ?? "未知"}」，需要「{USER_LEVEL[4].label}」及以上才可写评价
        </p>
        <Link href={ROUTES.CERTIFICATION}>
          <Button>去认证中心提升权限</Button>
        </Link>
      </div>
    );
  }

  const isSubmitting = upsertScore.isPending || createComment.isPending;
  const submitError = upsertScore.isError
    ? (upsertScore.error as Error)?.message || "评分提交失败"
    : createComment.isError
    ? (createComment.error as Error)?.message || "评论提交失败"
    : null;

  const handleSubmit = async () => {
    if (score === 0) return;
    try {
      // 先提交认同度评分
      await upsertScore.mutateAsync({ postId, score: starToScore(score) });
      // 如果有评论内容，再提交评论
      if (content.trim()) {
        await createComment.mutateAsync({ postId, data: { content: content.trim() } });
      }
      router.push(ROUTES.POST_DETAIL(postId));
    } catch {
      // mutation 自行处理错误
    }
  };

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <Link href={ROUTES.POST_DETAIL(postId)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> 返回详情
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">提交评价</CardTitle>
          {post && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{categoryLabel}</Badge>
              <span className="truncate">{post.title || "(无标题)"}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 资格提示 */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {effectiveLevel >= 5
              ? "✅ 您是大V用户，可免当次验证直接提交评价。"
              : effectiveLevel === 4
              ? "💡 您是实人认证用户，发帖前需完成本次实人验证。"
              : `当前层级「${USER_LEVEL[effectiveLevel as keyof typeof USER_LEVEL]?.label ?? "未知"}」，需完成认证才可发帖。`}
          </div>

          {/* 星级评分 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">认同度评分 *</label>
            <div className="flex gap-1">
              {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverScore(star)}
                  onMouseLeave={() => setHoverScore(0)}
                  onClick={() => setScore(star)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverScore || score)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {score > 0 && (
              <p className="text-xs text-muted-foreground">{score} 星 · 认同度 {starToScore(score)} 分</p>
            )}
          </div>

          {/* 文字评价（评论） */}
          <div className="space-y-2">
            <label className="text-sm font-medium">评价内容（选填）</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="分享您的真实体验..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={AGREEMENT.CONTENT_MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length} / {AGREEMENT.CONTENT_MAX_LENGTH}
            </p>
          </div>

          {/* 提交错误 */}
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          {/* 提交按钮 */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={score === 0 || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交评价
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
