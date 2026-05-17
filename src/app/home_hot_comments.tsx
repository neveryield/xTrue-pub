"use client";

import Link from "next/link";
import { Quote, MessageCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useComments } from "@/modules/review/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function HotCommentsSection({ postIds }: { postIds: string[] }) {
  return (
    <section className="py-4 md:py-6">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
            <Quote className="h-3 w-3 text-emerald-600" />
          </div>
          <h2 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#8B9B90]">热门评论</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {postIds.map((postId) => (
            <HotCommentCard key={postId} postId={postId} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HotCommentCard({ postId }: { postId: string }) {
  const { data, isLoading } = useComments(postId, { offset: 0, limit: 3 });
  const comments = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#D8E8DF]/50 bg-white/80 p-5 backdrop-blur-sm">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-emerald-100" />
        <div className="pl-1 space-y-3">
          <Skeleton className="h-5 w-16 rounded-md bg-[#EDF5F0]" />
          <Skeleton className="h-[15px] w-full rounded-md bg-[#F5F9F7]" />
          <Skeleton className="h-[15px] w-2/3 rounded-md bg-[#F5F9F7]" />
        </div>
      </div>
    );
  }

  if (comments.length === 0) return null;

  const topComment = comments.reduce(
    (best: any, c: any) => ((c.agree_count ?? 0) > (best.agree_count ?? 0) ? c : best),
    comments[0],
  );

  return (
    <Link
      href={ROUTES.POST_DETAIL(postId)}
      className="group relative flex rounded-2xl border border-[#D8E8DF]/40 bg-white/80 p-5 no-underline backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/50 hover:bg-white hover:shadow-[0_6px_24px_-6px_rgba(60,140,100,0.10)]"
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-emerald-400/40 to-emerald-600/40 transition-all duration-300 group-hover:from-emerald-400/60 group-hover:to-emerald-600/60" />

      <div className="pl-2">
        <div className="mb-3 text-emerald-300/40">
          <Quote className="h-5 w-5" />
        </div>

        <p className="line-clamp-3 text-[13px] leading-relaxed text-[#6B655E] transition-colors group-hover:text-emerald-700">
          {topComment.content}
        </p>

        <div className="mt-4 flex items-center gap-2.5 border-t border-[#F0EDE7] pt-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-bold text-white">
            {String(topComment.author_id).charAt(0)}
          </div>
          <span className="text-[12px] font-medium text-[#B8B0A4]">用户{topComment.author_id}</span>
          <span className="text-[11px] text-[#D0C9BE]">· {topComment.time_label}</span>
        </div>

        {topComment.agree_count > 0 && (
          <div className="mt-2 text-[12px] font-medium text-emerald-600">
            👍 {topComment.agree_count}
          </div>
        )}
      </div>
    </Link>
  );
}
