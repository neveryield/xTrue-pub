"use client";

import Link from "next/link";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentCard } from "./post_comment_card";

export interface CommentListProps {
  postId: string;
  isAuthenticated: boolean;
  effectiveLevel: number;
  canComment: boolean;
  user: any;
  /** Comments data from the API */
  commentsData: { items: any[]; total: number } | undefined;
  isLoading: boolean;
  isError: boolean;
  /** Comment input state */
  commentText: string;
  setCommentText: (v: string) => void;
  onSubmitComment: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  /** Pagination */
  page: number;
  setPage: (v: number) => void;
  pageSize: number;
  /** Reaction mutations */
  commentReaction: any;
  deleteCommentReaction: any;
  createComment: any;
}

export function CommentList({
  postId,
  isAuthenticated,
  effectiveLevel,
  canComment,
  user,
  commentsData,
  isLoading,
  isError,
  commentText,
  setCommentText,
  onSubmitComment,
  isSubmitting,
  submitError,
  page,
  setPage,
  pageSize,
  commentReaction,
  deleteCommentReaction,
  createComment,
}: CommentListProps) {
  const total = commentsData?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  const userAvatar = (user?.nickname || "?").charAt(0);

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold">
        评论 <span className="text-sm font-normal text-muted-foreground">({total})</span>
      </h2>

      {/* 写评论 */}
      {isAuthenticated && canComment ? (
        <div className="mb-6 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
            {userAvatar}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              className="flex min-h-[72px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/40"
              placeholder="写下你的看法..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={5000}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground/50">{commentText.length}/5000</span>
              <Button size="sm" className="rounded-xl gap-1.5" disabled={!commentText.trim() || isSubmitting} onClick={onSubmitComment}>
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                发表
              </Button>
            </div>
            {submitError && <p className="text-xs text-danger">{submitError}</p>}
          </div>
        </div>
      ) : isAuthenticated ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          需完成实人认证 (L3) 后才可评论。去
          <Link href={ROUTES.CERTIFICATION} className="font-semibold text-primary hover:underline mx-1">认证中心</Link>
          提升等级。
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-secondary p-4 text-center text-sm text-muted-foreground">
          <Link href={`${ROUTES.LOGIN}&redirect=${encodeURIComponent(`/posts/${postId}`)}`} className="font-semibold text-primary hover:underline">
            登录
          </Link>
          {" "}后参与讨论
        </div>
      )}

      {/* 错误 */}
      {isError && (
        <div className="py-8 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">评论加载失败</p>
        </div>
      )}

      {/* 加载 */}
      {!isError && isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* 列表 */}
      {!isError && !isLoading && commentsData && commentsData.items.length > 0 && (
        <div className="space-y-3">
          {commentsData.items.map((comment: any) => (
            <CommentCard
              key={comment.comment_id}
              comment={comment}
              postId={postId}
              isAuthenticated={isAuthenticated}
              canComment={canComment}
              userAvatar={userAvatar}
              commentReaction={commentReaction}
              deleteCommentReaction={deleteCommentReaction}
              createComment={createComment}
            />
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
              <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>下一页</Button>
            </div>
          )}
        </div>
      )}

      {/* 空状态 */}
      {!isError && !isLoading && commentsData && commentsData.items.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">暂无评论，来做第一个评论的人吧</p>
      )}
    </div>
  );
}
