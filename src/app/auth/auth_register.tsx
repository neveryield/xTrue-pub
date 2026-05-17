"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm } from "@/modules/auth/schemas";
import { useRegister } from "@/modules/auth/hooks";
import { ROUTES } from "@/lib/constants";
import { getSafeInternalRedirect } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Check, Shield, Lock, Sparkles } from "lucide-react";

const STEPS = ["设置账号", "设置密码", "完成"];

function maskAccountDisplay(raw: string): string {
  const s = (raw || "").trim();
  if (/^1[3-9]\d{9}$/.test(s)) return s.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  if (s.includes("@")) {
    const [name, domain] = s.split("@");
    if (!domain) return "***";
    return `${name.length > 2 ? name.slice(0, 2) + "***" : "***"}@${domain}`;
  }
  if (s.length <= 4) return "***";
  return `${s.slice(0, 2)}***${s.slice(-2)}`;
}

export function AuthRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegister();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { account: "", password: "", confirmPassword: "" },
  });

  const accountValue = watch("account");
  const passwordValue = watch("password");
  const confirmValue = watch("confirmPassword");

  const handleNext = async () => {
    if (step === 0) {
      const valid = await trigger("account");
      if (valid) setStep(1);
    } else if (step === 1) {
      const valid = await trigger(["password", "confirmPassword"]);
      if (valid) setStep(2);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      const dest = getSafeInternalRedirect(searchParams.get("redirect"), ROUTES.HOME);
      router.push(dest);
    } catch { /* handled */ }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border-border shadow-lg">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, hsl(200,75%,55%), hsl(6,78%,62%))" }} />
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />加入我们
            </div>
            <h1 className="font-display text-2xl font-bold">注册 xTrue</h1>
          </div>

          {/* 步骤指示器 */}
          <div className="mb-6 flex items-center justify-center gap-1.5">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-primary text-white shadow-sm" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-5 rounded-full ${i < step ? "bg-emerald-500" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">账号</label>
                  <Input type="text" autoComplete="username" placeholder="11位手机号、邮箱，或以字母开头的用户名" className="rounded-xl" {...register("account")} />
                  {errors.account && <p className="text-xs text-danger">{errors.account.message}</p>}
                </div>
                <Button type="button" className="w-full rounded-xl h-11" onClick={handleNext} disabled={!accountValue?.trim()}>下一步</Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">密码</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="8–64位密码" className="rounded-xl pr-10" {...register("password")} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">确认密码</label>
                  <Input type="password" placeholder="再次输入密码" className="rounded-xl" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(0)}>上一步</Button>
                  <Button type="button" className="flex-1 rounded-xl" onClick={handleNext} disabled={!passwordValue || !confirmValue}>下一步</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">账号与隐私</p>
                      <p className="text-xs text-emerald-700/70">手机号、邮箱仅存哈希；用户名仅存规范化形式</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">密码安全</p>
                      <p className="text-xs text-emerald-700/70">密码使用 bcrypt 安全存储</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-mono text-foreground">{maskAccountDisplay(accountValue || "")}</span>
                </div>
                {registerMutation.isError && <p className="text-sm text-danger">{(registerMutation.error as Error)?.message || "注册失败"}</p>}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>上一步</Button>
                  <Button type="submit" className="flex-1 rounded-xl" disabled={registerMutation.isPending}>
                    {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}完成注册
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            已有账号？{" "}
            <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">去登录</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
