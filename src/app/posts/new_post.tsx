"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/modules/product/hooks";
import { useUploadImage } from "@/modules/upload/hooks";
import { useFormatContent, useComplianceCheck } from "@/modules/ai/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { canPost } from "@/modules/auth/permissions";
import { RichEditor } from "@/components/ui/rich-editor";
import { ROUTES, CATEGORIES, USER_LEVEL } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Send, AlertCircle, ShieldCheck, Wand2, Eye, SearchCheck, Info } from "lucide-react";
import { toast } from "@/components/ui/toast";

const catColorMap: Record<string, { bg: string; text: string; stripe: string }> = {
  dining:   { bg: "hsl(25,85%,92%)",  text: "hsl(25,70%,35%)",  stripe: "hsl(25,85%,56%)" },
  leisure:  { bg: "hsl(160,65%,92%)", text: "hsl(160,60%,28%)", stripe: "hsl(160,65%,45%)" },
  media:    { bg: "hsl(280,65%,92%)", text: "hsl(280,50%,38%)", stripe: "hsl(280,65%,62%)" },
  other:    { bg: "hsl(200,75%,92%)", text: "hsl(200,60%,35%)", stripe: "hsl(200,75%,55%)" },
  free:     { bg: "hsl(340,65%,92%)", text: "hsl(340,55%,35%)", stripe: "hsl(340,65%,55%)" },
};

const SUB_CATEGORIES: Record<string, string[]> = {
  dining:   ["正餐", "快餐/简餐", "咖啡茶饮", "甜品烘焙", "小吃夜宵", "其他"],
  leisure:  ["景点景区", "主题乐园", "展览演出", "运动健身", "其他"],
  media:    ["电影", "电视剧", "音乐", "短剧", "视频", "其他"],
  other:    ["数码3C", "美妆个护", "服饰鞋包", "家居日用", "食品饮料", "其他"],
  free:     ["讨论", "树洞", "投票", "其他"],
};

const PREVIEW_KEY = "xpost_preview";

export function NewPostForm() {
  const router = useRouter();
  const { isAuthenticated, effectiveLevel } = useAuthStore();
  const createPost = useCreatePost();
  const uploadImage = useUploadImage();
  const formatContent = useFormatContent();
  const complianceCheck = useComplianceCheck();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentText, setContentText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [commitment, setCommitment] = useState(false);
  const [complianceResult, setComplianceResult] = useState<{ passed: boolean; issues: { message: string }[] } | null>(null);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const result = await uploadImage.mutateAsync(file);
    setImages((prev) => [...prev, result.url]);
    toast("图片已上传");
    return result.url;
  }, [uploadImage]);

  const handleFormat = useCallback(async () => {
    if (!contentHtml.trim()) return;
    try {
      const result = await formatContent.mutateAsync(contentHtml);
      setContentHtml(result.formatted);
      toast("排版完成", { description: "内容已自动格式化" });
    } catch { /* handled */ }
  }, [contentHtml, formatContent]);

  const handleComplianceCheck = useCallback(async () => {
    if (!contentText.trim()) return;
    try {
      const result = await complianceCheck.mutateAsync(contentText);
      setComplianceResult(result);
      if (result.passed) {
        toast("合规检查通过", { description: "未发现敏感内容" });
      } else {
        toast("合规检查未通过", { description: result.issues.map((i) => i.message).join("；") });
      }
    } catch { /* handled */ }
  }, [contentText, complianceCheck]);

  const handlePreview = useCallback(() => {
    sessionStorage.setItem(PREVIEW_KEY, JSON.stringify({ title: title.trim(), category, subcategory, content: contentHtml, images }));
    window.open("/posts/new/preview", "_blank");
  }, [title, category, subcategory, contentHtml, images]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="font-display text-xl font-semibold">请先登录</h2>
        <p className="text-muted-foreground">发布帖子需要登录账号</p>
        <Link href={`${ROUTES.LOGIN}&redirect=${encodeURIComponent(ROUTES.POST_NEW)}`}><Button className="rounded-xl">去登录</Button></Link>
      </div>
    );
  }

  if (!canPost(effectiveLevel)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="font-display text-xl font-semibold">权限不足</h2>
        <p className="text-muted-foreground">
          当前层级「{USER_LEVEL[effectiveLevel as keyof typeof USER_LEVEL]?.label ?? "未知"}」，需「{USER_LEVEL[4].label}」及以上才可发帖
        </p>
        <Link href={ROUTES.CERTIFICATION}><Button className="rounded-xl">去认证中心提升权限</Button></Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!category || !commitment) return;
    try {
      const result = await createPost.mutateAsync({
        title: title.trim() || undefined,
        category,
        subcategory: subcategory || "",
        content: contentHtml || "",
        images: images.length > 0 ? images : undefined,
        authenticity_ack: true,
      });
      sessionStorage.removeItem(PREVIEW_KEY);
      toast("发布成功", { description: "你的帖子已提交，审核通过后将公开展示" });
      const postId = result?.post_id;
      router.push(postId ? ROUTES.POST_DETAIL(postId) : ROUTES.HOME);
    } catch { /* handled */ }
  };

  const isValid = category && commitment;
  const colors = catColorMap[category] || undefined;
  const aiBusy = formatContent.isPending || complianceCheck.isPending;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <Link href={ROUTES.HOME} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> 返回首页
      </Link>

      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">发布<span className="text-primary">帖子</span></h1>
      <p className="mt-1 text-sm text-muted-foreground">分享你的真实体验，让声音被听见</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* 左侧：表单 */}
        <div className="space-y-5">
          <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
            <div className="h-1.5 w-full" style={{ background: colors?.stripe || "hsl(36,15%,90%)" }} />
            <CardContent className="space-y-5 p-6">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{effectiveLevel >= 5 ? "你是大V用户，可免本次实人验证直接发帖。" : "发帖前需完成本次实人验证，请先在认证中心完成。"}</span>
              </div>

              {/* 标题 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">标题 <span className="text-muted-foreground font-normal">(选填)</span></label>
                <input type="text" placeholder="一句话概括你的体验..." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-[15px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <p className="text-right text-[11px] text-muted-foreground">{title.length}/200</p>
              </div>

              {/* 品类 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">品类 *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ key, label, icon }) => {
                    const c = catColorMap[key] || catColorMap.other;
                    const active = category === key;
                    return (
                      <button key={key} type="button" onClick={() => { setCategory(key); setSubcategory(""); }}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all"
                        style={{ backgroundColor: active ? c.stripe : "#fff", color: active ? "#fff" : c.text, borderColor: active ? c.stripe : "hsl(36,15%,90%)" }}>
                        {icon} {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 子品类 */}
              {category && SUB_CATEGORIES[category] && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">子品类</label>
                  <div className="flex flex-wrap gap-2">
                    {SUB_CATEGORIES[category].map((sub) => (
                      <button key={sub} type="button" onClick={() => setSubcategory(sub === subcategory ? "" : sub)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                          subcategory === sub ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground hover:border-primary/30"
                        }`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 富文本编辑器 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">正文</label>
                <RichEditor content={contentHtml} onChange={(html, text) => { setContentHtml(html); setContentText(text); }} onImageUpload={handleImageUpload} />
                {complianceResult && !complianceResult.passed && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 space-y-1">
                    <p className="font-semibold">合规检查发现问题：</p>
                    {complianceResult.issues.map((issue, i) => (
                      <p key={i} className="flex items-start gap-1.5"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{issue.message}</p>
                    ))}
                  </div>
                )}
                {complianceResult?.passed && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-2.5 text-sm text-green-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />合规检查通过，未发现敏感内容
                  </div>
                )}
              </div>

              {/* 真实性承诺 */}
              <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border bg-secondary/50 p-4">
                <input type="checkbox" checked={commitment} onChange={(e) => setCommitment(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-primary" />
                <div>
                  <p className="text-sm font-semibold">真实性承诺 *</p>
                  <p className="text-xs text-muted-foreground mt-0.5">我承诺以上内容基于真实体验，不存在虚假陈述或恶意评价。虚假内容可能导致账号等级降级或封禁。</p>
                </div>
              </label>

              {createPost.isError && <p className="text-sm text-danger">{(createPost.error as Error)?.message || "发布失败，请重试"}</p>}

              <Button onClick={handleSubmit} disabled={!isValid || createPost.isPending} className="w-full rounded-xl gap-2 h-11">
                {createPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                提交审核
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">发布后进入审核队列，审核通过后将公开展示</p>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：工具侧边栏 */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">工具</p>
                <Button variant="outline" size="sm" onClick={handleFormat} disabled={aiBusy || !contentHtml.trim()} className="w-full rounded-xl justify-start gap-2">
                  {formatContent.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}一键排版
                </Button>
                <Button variant="outline" size="sm" onClick={handleComplianceCheck} disabled={aiBusy || !contentText.trim()} className="w-full rounded-xl justify-start gap-2">
                  {complianceCheck.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SearchCheck className="h-3.5 w-3.5" />}合规检查
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreview} className="w-full rounded-xl justify-start gap-2">
                  <Eye className="h-3.5 w-3.5" />新窗口预览
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground flex items-center gap-1.5"><Info className="h-3 w-3" />发布须知</p>
                <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                  <li>· 标题为选填，建议简洁概括</li>
                  <li>· 正文支持富文本、图片、代码块</li>
                  <li>· 图片最多 3 张，支持 PNG/JPEG/WebP</li>
                  <li>· 点击工具栏图片按钮插入图片</li>
                  <li>· 发布后进入审核，通过后公开展示</li>
                  <li>· 必须勾选真实性承诺才能提交</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
