/**
 * HomeHero — 首页顶部 Hero 区域
 * 5秒后自动淡出 + 上滑 + 高度收缩，动画结束后卸载
 * 仅使用 opacity/transform (GPU合成) + maxHeight (布局收缩)，避免 grid-rows 触发主线程重排
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HeroProps {
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  totalPosts?: number;
  onDismiss?: () => void;
}

export function HomeHero({ activeCategory, onCategoryChange, totalPosts, onDismiss }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  useEffect(() => {
    // 测量实际高度，用于 maxHeight 动画
    if (heroRef.current) {
      setMeasuredHeight(heroRef.current.scrollHeight);
    }
    timerRef.current = setTimeout(() => setFadeOut(true), 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      // 只响应 maxHeight 过渡结束（高度收缩完成后卸载）
      if (e.target === heroRef.current && fadeOut && e.propertyName === "max-height") {
        onDismiss?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [onDismiss, fadeOut],
  );

  return (
    <section
      ref={heroRef}
      onTransitionEnd={handleTransitionEnd}
      style={{
        maxHeight: fadeOut && measuredHeight !== null ? 0 : measuredHeight ?? undefined,
      }}
      className={cn(
        "relative overflow-hidden bg-[#FBFAF7] transition-[opacity,transform,max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-center origin-top will-change-[opacity,transform,max-height]",
        fadeOut ? "opacity-0 -translate-y-3 scale-[0.98]" : "opacity-100 translate-y-0 scale-100"
      )}
    >
      <div>
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.015]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* Simplified background decorations */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-[10%] -top-[20%] h-[500px] w-[500px] rounded-full border border-amber-200/20" />
          <div className="absolute -left-[5%] bottom-0 h-[300px] w-[300px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #C67B5C 0%, transparent 70%)" }} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div className="flex-1 max-w-2xl">
              {/* Tiny badge */}
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-200/40 bg-amber-50/40 px-3 py-1 text-[10px] font-medium tracking-[0.1em] text-amber-700/80 uppercase backdrop-blur-sm">
                <Sparkles className="h-2.5 w-2.5 text-amber-500/70" />
                真实评价平台
              </div>

              {/* Adjusted headline - no longer "loud" */}
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1E1B18] md:text-5xl lg:text-6xl">
                让<span
                  className="relative mx-0.5 inline-block italic text-amber-600"
                >
                  真实
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber-400/30" />
                </span>
                被听见
              </h1>

              <p className="mt-4 max-w-[400px] text-[15px] leading-relaxed text-[#8B8478]">
                认同度评分 · 分层身份认证 · 真实性承诺
              </p>

              {/* Category text links - integrated into main layout */}
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                {CATEGORIES.map(({ key, label, icon }, i) => {
                  const active = key === activeCategory;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onCategoryChange(active ? "" : key)}
                      className={`inline-flex items-center gap-1 transition-all duration-200 ${
                        active
                          ? "font-semibold text-amber-600"
                          : "text-[#B8B0A4] hover:text-amber-700"
                      }`}
                    >
                      <span className="text-[12px]">{icon}</span> {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: total posts stat - cleaner implementation */}
            {totalPosts != null && (
              <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3 rounded-2xl border border-[#E8E3DA]/60 bg-white/60 px-5 py-3 backdrop-blur-sm shadow-sm">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  <span className="text-[13px] text-[#8B8478]">
                    <span className="font-display text-2xl font-bold tabular-nums text-[#1E1B18]">{totalPosts.toLocaleString()}</span>
                    <span className="ml-1">篇真实评价</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-4 px-2">
                  <div className="text-right">
                    <div className="font-display text-3xl font-extrabold text-[#1E1B18]">99.2%</div>
                    <div className="text-[10px] font-semibold tracking-wider text-[#B8B0A4]">审核通过率</div>
                  </div>
                  <div className="h-10 w-[1px] bg-amber-200/30" />
                  <div className="text-right">
                    <div className="font-display text-3xl font-extrabold text-[#1E1B18]">15k+</div>
                    <div className="text-[10px] font-semibold tracking-wider text-[#B8B0A4]">认证用户</div>
                  </div>
                  <span className="text-[9px] text-[#B8B0A4]/60">示例数据</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
