/**
 * 认证页 — 登录/注册双Tab
 * URL: /auth?tab=login | /auth?tab=register
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLogin } from "./auth_login";
import { AuthRegister } from "./auth_register";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "login";

  return tab === "register" ? <AuthRegister /> : <AuthLogin />;
}

function AuthSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-lg space-y-4">
        <Skeleton className="mx-auto h-6 w-28 rounded-full" />
        <Skeleton className="mx-auto h-8 w-40" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
