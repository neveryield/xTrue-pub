/** 首页底部 CTA 区域 — 支持各品类主题色变体 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

type CTAVariant = "default" | "leisure" | "dining" | "media" | "other";

interface VariantConfig {
  bgGradient: string;
  heading: string;
  subheading: string;
}

const VARIANT_CONFIGS: Record<CTAVariant, VariantConfig> = {
  default: {
    bgGradient: "linear-gradient(155deg, #C8883C 0%, #D4984C 30%, #C67B3A 100%)",
    heading: "准备好分享真实体验了吗？",
    subheading: "让你的声音成为值得信赖的参考。",
  },
  leisure: {
    bgGradient: "linear-gradient(160deg, #0C5C38 0%, #0E7B4E 30%, #10885A 100%)",
    heading: "分享你的玩乐体验",
    subheading: "真实评价，帮助更多人找到值得去的体验。",
  },
  dining: {
    bgGradient: "linear-gradient(155deg, #C44D2F 0%, #D45838 30%, #B84228 100%)",
    heading: "记录你的味蕾旅程",
    subheading: "每一家店都值得一个真实的评价。",
  },
  media: {
    bgGradient: "linear-gradient(155deg, #5B3E9B 0%, #6B4EAB 30%, #4E338A 100%)",
    heading: "分享你的观影心得",
    subheading: "拒绝云评价，让真实的感受被听见。",
  },
  other: {
    bgGradient: "linear-gradient(155deg, #3A6A8C 0%, #4A7A9C 30%, #2E5E7E 100%)",
    heading: "品鉴器物，真实发声",
    subheading: "用数据与体验，让好产品自己说话。",
  },
};

export function HomeCTA({ variant = "default" }: { variant?: CTAVariant }) {
  const config = VARIANT_CONFIGS[variant] ?? VARIANT_CONFIGS.default;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{ background: config.bgGradient }}
        >
          {/* Decorative diagonal slash */}
          <div className="pointer-events-none absolute -left-[5%] top-0 h-full w-[40%] -skew-x-[14deg] bg-white/[0.04]" />
          <div className="pointer-events-none absolute left-[32%] top-0 h-full w-[2px] -skew-x-[14deg] bg-white/[0.06]" />

          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -right-[8%] -top-[30%] h-[350px] w-[350px] rounded-full bg-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-[30%] -left-[5%] h-[280px] w-[280px] rounded-full bg-white/[0.04]" />

          {/* Content — asymmetric */}
          <div className="relative flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:gap-12 md:px-10 md:py-10">
            {/* Left: statement */}
            <div className="md:flex-1">
              <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[3rem]">
                {config.heading}
              </h2>
              <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-white/55">
                {config.subheading}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
              <Link href={ROUTES.REGISTER}>
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-[15px] font-bold text-[#1E1B18] shadow-lg shadow-black/12 transition-all hover:bg-white/95 hover:shadow-xl hover:shadow-black/18 active:scale-[0.97]"
                >
                  立即注册
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                href={ROUTES.HOME}
                className="rounded-lg px-2 py-1.5 text-[14px] font-medium text-white/50 no-underline transition-all hover:text-white/80"
              >
                先浏览看看
              </Link>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>
    </section>
  );
}
