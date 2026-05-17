"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, smsLoginSchema, type LoginForm, type SmsLoginForm } from "@/modules/auth/schemas";
import { useLogin, useLoginSms, useSendSmsCode } from "@/modules/auth/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES } from "@/lib/constants";
import { getSafeInternalRedirect } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function AuthLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const loginSmsMutation = useLoginSms();
  const sendSmsMutation = useSendSmsCode();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState("password");

  useEffect(() => {
    useAuthStore.getState().restore().then(() => {
      if (useAuthStore.getState().isAuthenticated) {
        const dest = getSafeInternalRedirect(searchParams.get("redirect"), ROUTES.HOME);
        router.replace(dest);
      }
    });
  }, [router, searchParams]);

  const pwdForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { account: "", password: "" },
  });

  const smsForm = useForm<SmsLoginForm>({
    resolver: zodResolver(smsLoginSchema),
    defaultValues: { phone: "", code: "" },
  });

  const onPasswordSubmit = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
      const dest = getSafeInternalRedirect(searchParams.get("redirect"), ROUTES.HOME);
      router.push(dest);
    } catch { /* handled */ }
  };

  const onSendCode = async () => {
    const ok = await smsForm.trigger("phone");
    if (!ok) return;
    const phone = smsForm.getValues("phone").trim();
    try {
      const res = await sendSmsMutation.mutateAsync(phone);
      toast(res.message, {
        description: res.debug_code
          ? `开发环境验证码：${res.debug_code}`
          : `有效期约 ${Math.round(res.expires_in / 60)} 分钟`,
      });
    } catch { /* handled */ }
  };

  const onSmsSubmit = async (data: SmsLoginForm) => {
    try {
      await loginSmsMutation.mutateAsync(data);
      const dest = getSafeInternalRedirect(searchParams.get("redirect"), ROUTES.HOME);
      router.push(dest);
    } catch { /* handled */ }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border-border shadow-lg">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, hsl(6,78%,62%), hsl(28,100%,65%))" }} />
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />欢迎回来
            </div>
            <h1 className="font-display text-2xl font-bold">登录 xTrue</h1>
            <p className="mt-1 text-sm text-muted-foreground">真实评价，让真实声音被听见</p>
          </div>

          <Tabs value={loginMode} onValueChange={setLoginMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary p-1">
              <TabsTrigger value="password" className="rounded-lg text-sm font-medium">账号密码</TabsTrigger>
              <TabsTrigger value="sms" className="rounded-lg text-sm font-medium">手机验证码</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-5 space-y-4">
              <form onSubmit={pwdForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">账号</label>
                  <Input type="text" autoComplete="username" placeholder="手机号、邮箱或用户名" className="rounded-xl" {...pwdForm.register("account")} />
                  {pwdForm.formState.errors.account && <p className="text-xs text-danger">{pwdForm.formState.errors.account.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">密码</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="8–64 位密码" className="rounded-xl pr-10" {...pwdForm.register("password")} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {pwdForm.formState.errors.password && <p className="text-xs text-danger">{pwdForm.formState.errors.password.message}</p>}
                </div>
                {loginMutation.isError && <p className="text-sm text-danger">{(loginMutation.error as Error)?.message || "登录失败"}</p>}
                <Button type="submit" className="w-full rounded-xl h-11" disabled={loginMutation.isPending}>
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登录
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="sms" className="mt-5 space-y-4">
              <form onSubmit={smsForm.handleSubmit(onSmsSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">手机号</label>
                  <Input type="tel" autoComplete="tel" placeholder="11 位手机号" className="rounded-xl" {...smsForm.register("phone")} />
                  {smsForm.formState.errors.phone && <p className="text-xs text-danger">{smsForm.formState.errors.phone.message}</p>}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-semibold">验证码</label>
                    <Input placeholder="6 位数字" className="rounded-xl" {...smsForm.register("code")} />
                    {smsForm.formState.errors.code && <p className="text-xs text-danger">{smsForm.formState.errors.code.message}</p>}
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="shrink-0 rounded-xl" disabled={sendSmsMutation.isPending} onClick={onSendCode}>
                      {sendSmsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "获取验证码"}
                    </Button>
                  </div>
                </div>
                {loginSmsMutation.isError && <p className="text-sm text-danger">{(loginSmsMutation.error as Error)?.message || "登录失败"}</p>}
                <Button type="submit" className="w-full rounded-xl h-11" disabled={loginSmsMutation.isPending}>
                  {loginSmsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登录
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            没有账号？{" "}
            <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">去注册</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
