import { Eye, Sparkles, Users, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
  icon: typeof Eye;
}

/** @todo 接入真实统计 API 后替换硬编码数据 */
const STATS: StatItem[] = [
  { value: "42,680", label: "累计帖子", icon: Eye },
  { value: "286,000+", label: "认同度打分", icon: Sparkles },
  { value: "15,840", label: "实名认证用户", icon: Users },
  { value: "99.2%", label: "审核通过率", icon: ShieldCheck },
];

const LEISURE_STATS: StatItem[] = [
  { value: "12,540", label: "玩乐帖子", icon: Eye },
  { value: "86,000+", label: "认同度打分", icon: Sparkles },
  { value: "8,320", label: "实名认证用户", icon: Users },
  { value: "99.2%", label: "审核通过率", icon: ShieldCheck },
];

const OTHER_STATS: StatItem[] = [
  { value: "9,720", label: "器物帖子", icon: Eye },
  { value: "64,000+", label: "认同度打分", icon: Sparkles },
  { value: "6,150", label: "实名认证用户", icon: Users },
  { value: "99.2%", label: "审核通过率", icon: ShieldCheck },
];

function StatItemView({ item, variant }: { item: StatItem; variant: "default" | "leisure" | "dining" | "other" }) {
  const Icon = item.icon;
  const isDining = variant === "dining";
  const iconColor = isDining ? "text-[#E34D2F]" : variant === "leisure" ? "text-emerald-500" : variant === "other" ? "text-sky-500" : "text-amber-500";
  
  const iconBg = isDining 
    ? "bg-[#E34D2F]/10" 
    : variant === "leisure" 
    ? "bg-emerald-50" 
    : variant === "other"
    ? "bg-sky-50"
    : "bg-amber-50";

  return (
    <div className="group flex items-center gap-3">
      <div className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 md:h-10 md:w-10",
        iconBg
      )}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn(
          "font-display font-extrabold leading-none tracking-tight text-[#1E1B18] tabular-nums",
          isDining ? "text-xl md:text-2xl lg:text-3xl" : "text-2xl md:text-3xl lg:text-4xl"
        )}>
          {item.value}
        </div>
        <div className="mt-1 truncate text-[11px] font-medium tracking-wide text-[#8B8478] md:text-[12px]">
          {item.label}
        </div>
      </div>
    </div>
  );
}

export function HomeStatsBar({ variant = "default" }: { variant?: "default" | "leisure" | "dining" | "other" }) {
  const stats = variant === "leisure" ? LEISURE_STATS : variant === "other" ? OTHER_STATS : STATS;
  const isDining = variant === "dining";

  const bgClass = isDining
    ? "bg-[#FDFCF0]/80"
    : variant === "leisure"
    ? "bg-gradient-to-r from-emerald-50/20 via-white to-emerald-50/10"
    : variant === "other"
    ? "bg-gradient-to-r from-sky-50/20 via-white to-sky-50/10"
    : "bg-gradient-to-r from-amber-50/15 via-white to-amber-50/10";
    
  const borderClass = isDining 
    ? "border-[#E34D2F]/10" 
    : variant === "leisure" 
    ? "border-emerald-100/50" 
    : variant === "other"
    ? "border-sky-100/50"
    : "border-amber-100/40";

  const pyClass = isDining ? "py-8 md:py-12" : "py-12 md:py-20";

  return (
    <section className={cn("border-y w-full overflow-hidden", borderClass, pyClass, bgClass)}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8 lg:gap-x-12">
          {stats.map((item) => (
            <StatItemView key={item.label} item={item} variant={variant} />
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] text-[#B8B0A4]/50">* 以上为示例数据</p>
      </div>
    </section>
  );
}
