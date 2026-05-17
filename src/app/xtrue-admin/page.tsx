"use client";

import Link from "next/link";
import { ADMIN_ROUTES, ROUTES } from "@/lib/constants";
import { useAdminMe } from "@/modules/admin-console/hooks";

export default function XTrueAdminHomePage() {
  const { data: me, isLoading, isError, error } = useAdminMe();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">控制台</h1>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">后端会话</p>
        {isLoading && <p className="mt-2 text-slate-400">加载中…</p>}
        {isError && (
          <p className="mt-2 text-amber-300">
            无法拉取 <code className="rounded bg-slate-800 px-1">GET /api/v1/admin/me</code>
            ：{(error as Error)?.message ?? "请检查登录与后端 ADMIN_USER_IDS"}
          </p>
        )}
        {me && (
          <ul className="mt-2 space-y-1 text-slate-300">
            <li>user_id: {me.user_id}</li>
            <li>user_level: {me.user_level}</li>
            <li>is_staff: {me.is_staff ? "是" : "否"}</li>
          </ul>
        )}
      </div>

      <p className="text-sm text-slate-400">
        主站数据见{" "}
        <Link href={ROUTES.HOME} className="text-blue-400 hover:underline">
          首页
        </Link>
        。左侧导航进入各运营页。
      </p>
      <p className="text-xs text-slate-500">
        无权限页：{" "}
        <Link href={ADMIN_ROUTES.FORBIDDEN} className="text-slate-400 hover:underline">
          {ADMIN_ROUTES.FORBIDDEN}
        </Link>
      </p>
    </div>
  );
}
