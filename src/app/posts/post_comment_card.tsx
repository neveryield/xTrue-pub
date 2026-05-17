"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CornerDownRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CommentCardProps {
  comment: any;
  postId: string;
  isAuthenticated: boolean;
  canComment: boolean;
  userAvatar: string;
  commentReaction: any;
  deleteCommentReaction: any;
  createComment: any;
}

export function CommentCard({
  comment,
  postId,
  isAuthenticated,
  canComment,
  userAvatar,
  commentReaction,
  createComment,
}: CommentCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await createComment.mutateAsync({
        postId,
        data: { content: replyText.trim(), quote_comment_id: comment.comment_id },
      });
      setReplyText("");
      setShowReply(false);
    } catch { /* handled */ }
  };

  return (
    <div className="group relative rounded-xl border border-border/50 bg-white p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
      {/* 引用嵌套（仅一层） */}
      {comment.quoted_comment && (
        <div className="mb-3 rounded-lg border-l-2 border-primary/30 bg-gradient-to-r from-slate-50 to-transparent pl-3 py-2 pr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary/60">
              {String(comment.quoted_comment.author_id).charAt(0)}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              用户{comment.quoted_comment.author_id}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
            {comment.quoted_comment.content}
          </p>
        </div>
      )}

      {/* 头部 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
          {String(comment.author_id).charAt(0)}
        </div>
        <span className="text-sm font-semibold text-foreground/80">用户{comment.author_id}</span>
        <span className="text-[11px] text-muted-foreground/40">· {comment.time_label}</span>
      </div>

      {/* 正文 */}
      <p className="text-sm leading-relaxed text-foreground/85 pr-12">{comment.content}</p>

      {/* Hover 浮出操作栏 */}
      <div className="absolute right-3 top-3 flex flex-col items-center gap-0.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); commentReaction.mutate({ postId, commentId: comment.comment_id, type: "agree" }); }}
          disabled={commentReaction.isPending}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-colors"
          title="认同"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {comment.agree_count > 0 && <span className="tabular-nums">{comment.agree_count}</span>}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); commentReaction.mutate({ postId, commentId: comment.comment_id, type: "disagree" }); }}
          disabled={commentReaction.isPending}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          title="反对"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          {comment.disagree_count > 0 && <span className="tabular-nums">{comment.disagree_count}</span>}
        </button>
        {isAuthenticated && canComment && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowReply(!showReply); setReplyText(""); }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground/50 hover:text-foreground hover:bg-slate-100 transition-colors"
            title="引用回复"
          >
            <CornerDownRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 内联回复框 */}
      {showReply && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
              {userAvatar}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                className="flex min-h-[60px] w-full rounded-xl border border-border bg-slate-50/50 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/40 transition-colors"
                placeholder={`回复 用户${comment.author_id}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={5000}
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs" onClick={() => { setShowReply(false); setReplyText(""); }}>
                  取消
                </Button>
                <Button size="sm" className="rounded-lg h-8 gap-1 text-xs" disabled={!replyText.trim() || createComment.isPending} onClick={handleReply}>
                  {createComment.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  回复
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
