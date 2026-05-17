"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";
import { useCertStatus, useCertifyRealName, useCertifyRealPerson, useVerifySession } from "@/modules/certification/hooks";
import { ROUTES, USER_LEVEL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Fingerprint, ScanFace, Award } from "lucide-react";
import { realNameCertSchema, type RealNameCertForm } from "@/modules/certification/schemas";

const STEP_ICONS = [UserCheck, Fingerprint, ScanFace];

export function CertificationPage() {
  const { isAuthenticated, userLevel, effectiveLevel } = useAuthStore();
  const { data: certStatus, isLoading: statusLoading } = useCertStatus();
  const certifyRealName = useCertifyRealName();
  const certifyRealPerson = useCertifyRealPerson();
  const verifySession = useVerifySession();

  const [realNameForm, setRealNameForm] = useState<RealNameCertForm>({ real_name: "", id_card: "" });
  const [realPersonToken, setRealPersonToken] = useState("");
  const [sessionVerifyToken, setSessionVerifyToken] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <ShieldCheck className="mx-auto h-14 w-14 text-primary/30" />
        <h2 className="font-display text-xl font-semibold">请先登录</h2>
        <p className="text-muted-foreground">认证中心需要登录后访问</p>
        <Link href={ROUTES.LOGIN}><Button className="rounded-xl">去登录</Button></Link>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentLevel = certStatus?.user_level ?? userLevel;
  const effective = certStatus?.effective_level ?? effectiveLevel;
  const realNameVerified = certStatus?.real_name_verified ?? false;
  const realPersonVerified = certStatus?.real_person_verified ?? false;
  const sessionVerified = certStatus?.session_verified ?? false;

  const levelInfo = USER_LEVEL[currentLevel as keyof typeof USER_LEVEL];
  const nextLevel = USER_LEVEL[(currentLevel + 1) as keyof typeof USER_LEVEL];

  const handleRealNameSubmit = async () => {
    const result = realNameCertSchema.safeParse(realNameForm);
    if (!result.success) { alert(result.error.issues.map((i) => i.message).join("\n")); return; }
    certifyRealName.mutate(result.data);
  };

  const steps = [
    {
      title: "实名认证",
      subtitle: "提交真实姓名和身份证号，通过后可打分",
      levelUp: "L1 → L2",
      verified: realNameVerified,
      unlocked: true,
      content: realNameVerified ? null : (
        <div className="space-y-3">
          <input type="text" placeholder="真实姓名" value={realNameForm.real_name}
            onChange={(e) => setRealNameForm((f) => ({ ...f, real_name: e.target.value }))}
            className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <input type="text" placeholder="身份证号" value={realNameForm.id_card}
            onChange={(e) => setRealNameForm((f) => ({ ...f, id_card: e.target.value }))}
            className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <Button onClick={handleRealNameSubmit} disabled={certifyRealName.isPending} className="w-full rounded-xl">
            {certifyRealName.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}提交实名认证
          </Button>
          {certifyRealName.isError && <p className="text-sm text-danger">{(certifyRealName.error as Error)?.message || "认证失败"}</p>}
        </div>
      ),
    },
    {
      title: "实人认证",
      subtitle: "通过人脸/视频验证，确认本人身份，通过后可评论+打分",
      levelUp: "L2 → L3",
      verified: realPersonVerified,
      unlocked: realNameVerified,
      content: realPersonVerified ? null : realNameVerified ? (
        <div className="space-y-3">
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">此功能需要对接人脸验证服务，当前为模拟输入</p>
          <input type="text" placeholder="验证凭证 (verify_token)" value={realPersonToken}
            onChange={(e) => setRealPersonToken(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <Button onClick={() => { if (realPersonToken.trim()) certifyRealPerson.mutate({ verify_token: realPersonToken }); }}
            disabled={certifyRealPerson.isPending || !realPersonToken.trim()} className="w-full rounded-xl">
            {certifyRealPerson.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}提交实人认证
          </Button>
          {certifyRealPerson.isError && <p className="text-sm text-danger">{(certifyRealPerson.error as Error)?.message || "认证失败"}</p>}
        </div>
      ) : null,
    },
    {
      title: "本次实人验证",
      subtitle: effective >= 5 ? "大V用户，免本次验证" : "实人认证用户发帖前需完成本次验证",
      levelUp: effective >= 5 ? "免验证" : "发帖前",
      verified: sessionVerified || effective >= 5,
      unlocked: realPersonVerified || effective >= 5,
      content: effective >= 5 ? null : sessionVerified ? null : realPersonVerified ? (
        <div className="space-y-3">
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">此功能需要对接人脸验证服务，当前为模拟输入</p>
          <input type="text" placeholder="验证凭证 (verify_token)" value={sessionVerifyToken}
            onChange={(e) => setSessionVerifyToken(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <Button onClick={() => { if (sessionVerifyToken.trim()) verifySession.mutate({ verify_token: sessionVerifyToken }); }}
            disabled={verifySession.isPending || !sessionVerifyToken.trim()} className="w-full rounded-xl">
            {verifySession.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}完成本次验证
          </Button>
          {verifySession.isError && <p className="text-sm text-danger">{(verifySession.error as Error)?.message || "验证失败"}</p>}
        </div>
      ) : null,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* 头部 */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">认证中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">完成认证以解锁更多权限</p>
      </div>

      {/* 当前状态卡 */}
      <Card className="mb-6 overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, hsl(200,75%,55%), hsl(6,78%,62%))" }} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">当前层级</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-display text-3xl font-bold">{levelInfo?.label ?? "未知"}</span>
                <Badge variant="outline">Lv.{currentLevel}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{levelInfo?.description}</p>
            </div>
            {nextLevel && (
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">下一层级</p>
                <p className="mt-1 font-display text-xl font-bold text-primary">{nextLevel.label}</p>
                <p className="text-sm text-muted-foreground">{nextLevel.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 认证步骤 */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx];
          const isVerified = step.verified;
          const isLocked = !step.unlocked;
          return (
            <Card key={step.title} className={`overflow-hidden rounded-2xl border-border shadow-sm transition-all ${
              isVerified ? "border-emerald-200 bg-emerald-50/30" : isLocked ? "opacity-50" : ""
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isVerified ? "bg-emerald-100 text-emerald-600" : isLocked ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {isVerified ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold">{step.title}</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">{step.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{step.levelUp}</Badge>
                </CardTitle>
              </CardHeader>
              {step.content && (
                <CardContent className="pb-5">
                  {isVerified ? <p className="text-sm text-emerald-600 font-medium">已完成 {step.title}</p>
                    : isLocked ? <p className="text-sm text-muted-foreground">需先完成上一步认证</p>
                    : step.content}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* 权限说明 */}
      <Card className="mt-6 rounded-2xl border-border shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5 text-primary" />权限说明</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(USER_LEVEL).map(([level, info]) => {
              const lv = parseInt(level);
              const isCurrent = lv === currentLevel;
              return (
                <div key={level} className={`flex items-center gap-3 rounded-xl p-2.5 text-sm transition-colors ${isCurrent ? "bg-primary/5 border border-primary/20" : ""}`}>
                  <Badge variant={isCurrent ? "default" : "outline"} className="w-16 justify-center text-[10px] shrink-0">Lv.{level}</Badge>
                  <span className="font-semibold w-24 shrink-0">{info.label}</span>
                  <span className="text-muted-foreground text-xs">— {info.description}</span>
                  {isCurrent && <ArrowRight className="ml-auto h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
