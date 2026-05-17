/**
 * ScoreRing 认同度环形图组件
 *
 * xTrue 核心视觉锚点 — 用环形进度展示认同度分数(0-100)
 * 色阶：<40 低(红) / 40-70 中(橙) / >70 高(绿)
 */

"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  /** 认同度分数 0-100 */
  score: number;
  /** 环大小 */
  size?: "sm" | "md" | "lg" | "xl";
  /** 是否显示分数值 */
  showValue?: boolean;
  /** 是否显示"认同度"标签 */
  showLabel?: boolean;
  /** 自定义类名 */
  className?: string;
}

const sizeConfig = {
  sm: { ring: 40, stroke: 3, fontSize: "0.75rem", labelSize: "0.5rem" },
  md: { ring: 56, stroke: 4, fontSize: "1rem", labelSize: "0.6rem" },
  lg: { ring: 80, stroke: 5, fontSize: "1.5rem", labelSize: "0.7rem" },
  xl: { ring: 120, stroke: 6, fontSize: "2.2rem", labelSize: "0.8rem" },
} as const;

function getScoreColor(score: number): string {
  if (score >= 70) return "text-score-high";
  if (score >= 40) return "text-score-mid";
  return "text-score-low";
}

function getScoreStroke(score: number): string {
  if (score >= 70) return "stroke-score-high";
  if (score >= 40) return "stroke-score-mid";
  return "stroke-score-low";
}

export function ScoreRing({
  score,
  size = "md",
  showValue = true,
  showLabel = false,
  className,
}: ScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const dashOffset = circumference * (1 - clampedScore / 100);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.ring}
        height={config.ring}
        className="-rotate-90"
      >
        {/* 背景环 */}
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-border"
        />
        {/* 进度环 */}
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(
            "transition-[stroke-dashoffset] duration-1000 ease-out",
            getScoreStroke(score),
          )}
        />
      </svg>
      {/* 中心数值 */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("font-mono font-semibold leading-none", getScoreColor(score))}
            style={{ fontSize: config.fontSize }}
          >
            {Math.round(score)}
          </span>
          {showLabel && (
            <span
              className="mt-0.5 text-muted-foreground"
              style={{ fontSize: config.labelSize }}
            >
              认同度
            </span>
          )}
        </div>
      )}
    </div>
  );
}
