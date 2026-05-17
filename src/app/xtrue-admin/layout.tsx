import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { AdminNav } from "@/modules/admin-console/comp.admin-nav";

export default function XTrueAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight text-slate-100">xTrue 管理</span>
          <Link
            href={ROUTES.HOME}
            className="text-xs text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            返回主站
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
