"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { ROUTES, CATEGORIES, SUBCATEGORIES, CAT_COLORS } from "@/lib/constants";
import { ScoreRing } from "@/components/ui/score-ring";

function stripHtml(html: string, maxLen: number): string {
  return html ? html.replace(/<[^>]*>/g, "").trim().slice(0, maxLen) : "";
}

function ModBadge({ status }: { status: number }) {
  if (status === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 ring-1 ring-amber-200/60">
        <span className="h-1 w-1 rounded-full bg-amber-400" /> 审核中
      </span>
    );
  }
  if (status === 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600 ring-1 ring-red-200/60">
        <span className="h-1 w-1 rounded-full bg-red-400" /> 未通过
      </span>
    );
  }
  return null;
}

/* ───── Card position helpers for grid variety ───── */

function isSpotlight(idx: number) { return idx === 0; }
function isTall(idx: number) { return idx === 4 || idx === 9; }

/* ═══════ Standard Grid Card (with tall variant) ═══════ */

export function PostCard({ post, index }: { post: any; index: number }) {
  const colors = CAT_COLORS[post.category] || CAT_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.key === post.category);
  const tall = isTall(index);
  const textPreview = stripHtml(post.content, tall ? 220 : 100);

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E3DA]/60 bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_12px_40px_-12px_rgba(180,140,80,0.15)] ${
        tall ? "lg:row-span-2" : ""
      }`}
      style={{
        animation: `cardReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both`,
        animationDelay: `${index * 50 + 80}ms`,
      }}
    >
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: colors.stripe }} />

      <div className={`flex flex-1 flex-col justify-between pl-5 ${tall ? "p-6" : "p-5"}`}>
        <div>
          {/* Category label + mod */}
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide"
              style={{ backgroundColor: colors.bg, color: colors.text }}>
              {catInfo?.icon} {catInfo?.label}
            </span>
            <ModBadge status={post.moderation_status} />
          </div>

          {/* Title */}
          <h3 className={`mt-3 font-display font-semibold leading-[1.3] tracking-[-0.01em] text-[#1E1B18] transition-colors group-hover:text-amber-600 ${
            tall ? "text-[19px]" : "text-[15px]"
          }`}>
            {post.title || "(无标题)"}
          </h3>

          {/* Preview */}
          {textPreview && (
            <p className={`mt-2 leading-relaxed text-[#8B8478] ${
              tall ? "line-clamp-5 text-[14px]" : "line-clamp-2 text-[13px]"
            }`}>
              {textPreview}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between ${
          tall ? "mt-5 border-t border-[#F0EDE7] pt-4" : "mt-4 border-t border-[#F0EDE7] pt-3"
        }`}>
          <div className="flex items-center gap-1.5 text-[12px] text-[#B8B0A4]">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="tabular-nums">{post.score_count ?? 0}</span>
          </div>
          <ScoreRing score={post.score_avg ?? 0} size="sm" showValue />
        </div>
      </div>

      {index === 0 && (
        <style>{`
          @keyframes cardReveal {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
    </Link>
  );
}

/* ═══════ Spotlight Card — wide, for first grid position ═══════ */

export function PostCardSpotlight({ post }: { post: any }) {
  const colors = CAT_COLORS[post.category] || CAT_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.key === post.category);
  const textPreview = stripHtml(post.content, 200);

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E3DA]/60 bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:col-span-2 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_12px_40px_-12px_rgba(180,140,80,0.15)]"
      style={{ animation: "cardReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both", animationDelay: "60ms" }}
    >
      {/* Top color bar — thicker */}
      <div className="h-[4px] w-full shrink-0" style={{ background: colors.stripe }} />

      <div className="flex flex-col gap-0 p-6 md:flex-row md:gap-8 md:p-7">
        {/* Left: main content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
                style={{ backgroundColor: colors.bg, color: colors.text }}>
                {catInfo?.icon} {catInfo?.label}
              </span>
              <ModBadge status={post.moderation_status} />
            </div>
            <h3 className="mt-3 font-display text-[1.35rem] font-bold leading-[1.2] tracking-[-0.015em] text-[#1E1B18] transition-colors group-hover:text-amber-600 md:text-[1.6rem]">
              {post.title || "(无标题)"}
            </h3>
            {textPreview && (
              <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-[#8B8478]">{textPreview}</p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <ScoreRing score={post.score_avg ?? 0} size="md" showValue />
            <div className="flex items-center gap-1.5 text-[13px] text-[#B8B0A4]">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="tabular-nums font-medium">{post.score_count ?? 0}</span>
              <span>条评论</span>
            </div>
          </div>
        </div>

        {/* Right: decorative quote-like element */}
        <div className="mt-4 flex shrink-0 items-start md:mt-0 md:w-[180px]">
          <div className="hidden rounded-xl border border-[#F0EDE7] bg-[#FBFAF7] p-4 md:block">
            <p className="text-[12px] leading-relaxed text-[#B8B0A4] italic">
              &ldquo;{textPreview.slice(0, 80)}{textPreview.length > 80 ? "..." : ""}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Hover reveal: "查看详情" */}
      <div className="absolute bottom-6 right-7 flex items-center gap-1 text-[13px] font-semibold text-amber-600 opacity-0 transition-opacity group-hover:opacity-100">
        查看详情 <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

/* ═══════ Featured Card — large, for magazine spread hero ═══════ */

export function PostCardFeatured({ post }: { post: any }) {
  const colors = CAT_COLORS[post.category] || CAT_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.key === post.category);
  const textPreview = stripHtml(post.content, 220);
  const hasImage = post.images && post.images.length > 0;

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[2rem] border border-[#E8E3DA]/60 bg-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:border-amber-200/80 hover:shadow-[0_32px_64px_-16px_rgba(180,140,80,0.2)] md:flex-row"
    >
      {/* 装饰性背景 */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-50/30 blur-3xl transition-colors group-hover:bg-amber-100/40" />
      
      {hasImage && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-[40%]">
          <img 
            src={post.images[0]} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col justify-between p-8 md:p-10">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div 
              className="flex h-8 items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-sm"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              <span className="text-[14px]">{catInfo?.icon}</span>
              {catInfo?.label}
            </div>
            <ModBadge status={post.moderation_status} />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#B8B0A4] uppercase tracking-widest">综合认同度</span>
              <ScoreRing score={post.score_avg ?? 0} size="md" showValue />
            </div>
          </div>

          <h3 className="font-display text-2xl font-black leading-[1.2] tracking-tight text-[#1E1B18] transition-colors group-hover:text-amber-600 md:text-3xl lg:text-4xl">
            {post.title || "(无标题)"}
          </h3>

          {textPreview && (
            <p className="mt-5 line-clamp-3 text-base leading-relaxed text-[#8B8478] md:line-clamp-4">
              {textPreview}
            </p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-[#F0EDE7] pt-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#8B8478]">
              <MessageCircle className="h-4 w-4 text-amber-500/60" />
              <span className="tabular-nums">{post.score_count ?? 0} 参与共鸣</span>
            </div>
            <div className="h-4 w-[1px] bg-[#E8E3DA]" />
            <div className="text-[13px] font-medium text-[#B8B0A4]">
              {new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[14px] font-black uppercase tracking-widest text-amber-600">
            发现 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════ Compact Card — for featured spread supporting positions ═══════ */

export function PostCardCompact({ post }: { post: any }) {
  const colors = CAT_COLORS[post.category] || CAT_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.key === post.category);

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group relative flex overflow-hidden rounded-3xl border border-[#E8E3DA]/60 bg-white p-5 transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_16px_32px_-12px_rgba(180,140,80,0.15)]"
    >
      <div className="absolute left-0 top-0 h-full w-[4px]" style={{ background: colors.stripe }} />
      <div className="flex flex-1 flex-col justify-between pl-3">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: colors.bg, color: colors.text }}>
              {catInfo?.label}
            </span>
            <ScoreRing score={post.score_avg ?? 0} size="sm" showValue />
          </div>
          <h3 className="line-clamp-2 font-display text-[16px] font-bold leading-[1.4] tracking-tight text-[#1E1B18] transition-colors group-hover:text-amber-600">
            {post.title || "(无标题)"}
          </h3>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#B8B0A4] uppercase tracking-widest">
          <span>{post.score_count ?? 0} 条评论</span>
          <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

/* ───── Leisure: Masonry Card ───── */

export function PostMasonryCard({ post, index }: { post: any; index: number }) {
  const leisureSubs = SUBCATEGORIES.leisure ?? [];
  const subLabel = leisureSubs.find((s) => s.key === post.subcategory)?.label ?? "";
  const textPreview = stripHtml(post.content, 120);

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[#D8E8DF]/60 bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:border-emerald-200/60 hover:shadow-[0_8px_30px_-8px_rgba(60,140,100,0.12)]"
      style={{
        animation: `cardReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both`,
        animationDelay: `${index * 50 + 80}ms`,
      }}
    >
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: "linear-gradient(180deg, #4EA07A, #3B8B63)" }} />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {subLabel && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700">
                {subLabel}
              </span>
            )}
            <ModBadge status={post.moderation_status} />
          </div>
          <ScoreRing score={post.score_avg ?? 0} size="sm" showValue />
        </div>
        <h3 className="mt-2.5 line-clamp-2 font-display text-[15px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#1E1B18] transition-colors group-hover:text-emerald-600">
          {post.title || "(无标题)"}
        </h3>
        {textPreview && (
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[#8B8478]">{textPreview}</p>
        )}
        <div className="mt-3 flex items-center gap-1 text-[11px] text-[#B8B0A4]">
          <MessageCircle className="h-3 w-3" />
          <span className="tabular-nums">{post.score_count ?? 0}</span>
          <span>条评论</span>
        </div>
      </div>
    </Link>
  );
}

/* ───── Leisure: Hot Horizontal Scroll Card ───── */

export function PostHotCard({ post, subs }: { post: any; subs: { key: string; label: string }[] }) {
  const subLabel = subs.find((s) => s.key === post.subcategory)?.label ?? "";

  return (
    <Link
      href={ROUTES.POST_DETAIL(post.post_id)}
      className="group w-[250px] shrink-0 overflow-hidden rounded-2xl bg-white no-underline shadow-[0_2px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-8px_rgba(60,140,100,0.15)] hover:ring-emerald-200/50"
    >
      <div
        className="relative px-4 pb-3 pt-4"
        style={{ background: "linear-gradient(145deg, #1A8A5E 0%, #0E7B4E 50%, #0C6B42 100%)" }}
      >
        <div className="pointer-events-none absolute -right-3 -top-4 h-16 w-16 rounded-full bg-white/[0.06]" />
        <div className="flex items-start justify-between">
          {subLabel ? (
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
              {subLabel}
            </span>
          ) : <span />}
          <div>
            <span className="font-display text-[1.65rem] font-bold leading-none text-white tabular-nums">
              {post.score_avg != null ? Math.round(post.score_avg) : "-"}
            </span>
            <span className="ml-0.5 text-[10px] text-white/50">分</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#1E1B18] transition-colors group-hover:text-emerald-600">
          {post.title || "(无标题)"}
        </h3>
        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[#B8B0A4]">
          <MessageCircle className="h-3 w-3" />
          <span className="tabular-nums">{post.score_count ?? 0}</span>
          <span>人评价</span>
        </div>
      </div>
    </Link>
  );
}
