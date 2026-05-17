/**
 * 发帖预览页 — 以读者视角预览帖子效果
 * 数据通过 sessionStorage 从发帖页传递
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES, CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, AlertCircle } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

const PREVIEW_KEY = "xpost_preview";

const catColorMap: Record<string, { bg: string; text: string; stripe: string }> = {
  dining:   { bg: "hsl(25,85%,92%)",  text: "hsl(25,70%,35%)",  stripe: "hsl(25,85%,56%)" },
  leisure:  { bg: "hsl(160,65%,92%)", text: "hsl(160,60%,28%)", stripe: "hsl(160,65%,45%)" },
  media:    { bg: "hsl(280,65%,92%)", text: "hsl(280,50%,38%)", stripe: "hsl(280,65%,62%)" },
  other:    { bg: "hsl(200,75%,92%)", text: "hsl(200,60%,35%)", stripe: "hsl(200,75%,55%)" },
  free:     { bg: "hsl(340,65%,92%)", text: "hsl(340,55%,35%)", stripe: "hsl(340,65%,55%)" },
};

interface PreviewData {
  title: string;
  category: string;
  subcategory: string;
  content: string;
  images: string[];
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(PREVIEW_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h2 className="font-display text-xl font-semibold">无预览数据</h2>
        <p className="text-muted-foreground">请先在发帖页填写内容后点击预览</p>
        <Link href={ROUTES.POST_NEW}>
          <Button className="rounded-xl">去发帖</Button>
        </Link>
      </div>
    );
  }

  const colors = catColorMap[data.category] || catColorMap.other;
  const catInfo = CATEGORIES.find((c) => c.key === data.category);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      {/* 顶部提示条 */}
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <Eye className="h-4 w-4" />
          预览模式 — 这是帖子发布后的展示效果（不含评分和评论）
        </div>
        <Link href={ROUTES.POST_NEW}>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
            <ChevronLeft className="h-3.5 w-3.5" />
            返回编辑
          </Button>
        </Link>
      </div>

      {/* 帖子内容卡片 — 与详情页风格一致 */}
      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="h-1.5 w-full" style={{ background: colors.stripe }} />
        <CardContent className="p-6">
          {/* 品类 + 子品类 */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {catInfo?.icon} {catInfo?.label}
            </span>
            {data.subcategory && (
              <Badge variant="outline" className="text-[11px]">{data.subcategory}</Badge>
            )}
          </div>

          <h1 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {data.title || "(无标题)"}
          </h1>

          {data.content && (
            <div
              className="mt-4 text-[15px] leading-relaxed text-foreground/85 prose prose-sm max-w-none [&_pre]:bg-slate-50 [&_pre]:text-slate-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-200 [&_pre_code]:text-[13px] [&_pre_code]:font-mono"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content) }}
            />
          )}

          {/* 图片展示 */}
          {data.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`图片 ${i + 1}`}
                  className="h-40 w-auto rounded-xl border border-border object-cover"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        以上为预览效果，实际展示可能因审核状态、用户权限等因素有所不同
      </p>
    </div>
  );
}
