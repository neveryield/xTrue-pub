/**
 * 帖子详情页 — 帖子内容 + 认同度评分 + 评论列表
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/modules/product/hooks";
import { useScoreStats, useUpsertScore, useComments, useCreateComment, useCommentReaction, useDeleteCommentReaction } from "@/modules/review/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES, CATEGORIES, USER_LEVEL, CAT_COLORS } from "@/lib/constants";
import { canScore, canComment } from "@/modules/auth/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Share2, Flag, AlertCircle } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { CommentList } from "../post_comment_list";
import { ResonanceCard } from "../post_resonance_card";

const COMMENT_LIMIT = 20;

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const { isAuthenticated, user, effectiveLevel } = useAuthStore();

  const { data: post, isLoading: postLoading, isError: postError } = useProductDetail(postId);
  const { data: scoreData, isError: scoreError } = useScoreStats(postId);
  const [commentPage, setCommentPage] = useState(0);
  const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useComments(postId, { offset: commentPage * COMMENT_LIMIT, limit: COMMENT_LIMIT });
  const upsertScore = useUpsertScore();
  const createComment = useCreateComment();
  const commentReaction = useCommentReaction();
  const deleteCommentReaction = useDeleteCommentReaction();

  const [myResonance, setMyResonance] = useState(0);
  const [commentText, setCommentText] = useState("");

  if (postLoading) return <PostDetailSkeleton />;

  if (!post) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">{postError ? "加载失败，请稍后重试" : "帖子不存在"}</p>
        <Link href={ROUTES.HOME}><Button variant="outline" className="mt-4 rounded-xl">返回首页</Button></Link>
      </div>
    );
  }

  const colors = CAT_COLORS[post.category] || CAT_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.key === post.category);
  const avgScore = scoreData?.score_avg;
  const scoreCount = scoreData?.score_count ?? 0;

  const handleResonance = async (level: number) => {
    setMyResonance(level);
    try { await upsertScore.mutateAsync({ postId, score: level * 10 }); } catch { /* handled */ }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await createComment.mutateAsync({ postId, data: { content: commentText.trim() } });
      setCommentText("");
    } catch { /* handled */ }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <Link href={ROUTES.HOME} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> 返回首页
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* 主内容 */}
        <div className="space-y-6">
          {/* 帖子内容卡片 */}
          <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
            <div className="h-1.5 w-full" style={{ background: colors.stripe }} />
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                  {catInfo?.icon} {catInfo?.label}
                </span>
                {post.subcategory && <Badge variant="outline" className="text-[11px]">{post.subcategory}</Badge>}
              </div>

              <h1 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
                {post.title || "(无标题)"}
              </h1>

              {post.moderation_status !== 1 && (
                <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  post.moderation_status === 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${post.moderation_status === 0 ? "bg-amber-500" : "bg-red-500"}`} />
                  {post.moderation_status === 0 ? "审核中" : "未通过审核"}
                </div>
              )}

              {post.content && (
                <div className="mt-4 text-[15px] leading-relaxed text-foreground/85 prose prose-sm max-w-none [&_pre]:bg-slate-50 [&_pre]:text-slate-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-200 [&_pre_code]:text-[13px] [&_pre_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
              )}

              {post.images && post.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.images.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`图片 ${i + 1}`} className="h-40 w-auto rounded-xl border border-border object-cover" />
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="h-3.5 w-3.5" /> 分享
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-danger transition-colors">
                  <Flag className="h-3.5 w-3.5" /> 举报
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 评论区域 */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-6">
              <CommentList
                postId={postId}
                isAuthenticated={isAuthenticated}
                effectiveLevel={effectiveLevel}
                canComment={canComment(effectiveLevel)}
                user={user}
                commentsData={commentsData}
                isLoading={commentsLoading}
                isError={commentsError}
                commentText={commentText}
                setCommentText={setCommentText}
                onSubmitComment={handleComment}
                isSubmitting={createComment.isPending}
                submitError={createComment.isError ? ((createComment.error as Error)?.message || "发表失败") : null}
                page={commentPage}
                setPage={setCommentPage}
                pageSize={COMMENT_LIMIT}
                commentReaction={commentReaction}
                deleteCommentReaction={deleteCommentReaction}
                createComment={createComment}
              />
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 — 共鸣卡片 */}
        <div className="space-y-6">
          <ResonanceCard
            avgScore={avgScore}
            scoreCount={scoreCount}
            scoreError={scoreError}
            isAuthenticated={isAuthenticated}
            canScore={canScore(effectiveLevel)}
            canPost={effectiveLevel >= 4}
            effectiveLevel={effectiveLevel}
            myResonance={myResonance}
            onResonance={handleResonance}
            isSubmitting={upsertScore.isPending}
            submitError={upsertScore.isError}
            postId={postId}
          />
        </div>
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <Skeleton className="mb-6 h-4 w-24" />
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-2xl">
            <div className="h-1.5 w-full bg-slate-100" />
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
