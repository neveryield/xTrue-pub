import Link from "next/link";
import { ADMIN_ROUTES, ROUTES } from "@/lib/constants";

export default function XTrueAdminForbiddenPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      <h1 className="text-lg font-semibold text-amber-200">无访问权限</h1>
      <p className="text-sm text-slate-400">
        当前账号不在管理白名单（<code className="rounded bg-slate-800 px-1 text-xs">ADMIN_USER_IDS</code>
        ）中，或令牌无效。请联系管理员配置环境变量后重新登录。
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href={ROUTES.HOME}
          className="text-sm text-blue-400 underline-offset-4 hover:underline"
        >
          返回首页
        </Link>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm text-slate-400 underline-offset-4 hover:underline"
        >
          切换账号
        </Link>
        <Link
          href={ADMIN_ROUTES.ROOT}
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          重试管理页
        </Link>
      </div>
    </div>
  );
}
