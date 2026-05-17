/**
 * 全局 Footer 组件 — proto_ds 风格
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/xtrue-admin")) {
    return null;
  }
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-extrabold text-white">
                x
              </div>
              <span className="text-sm font-bold">xTrue</span>
            </Link>
            <span className="text-xs text-slate-400">让真实声音被听见</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">隐私政策</span>
            <span className="hover:text-slate-600 cursor-pointer">用户协议</span>
            <span className="hover:text-slate-600 cursor-pointer">联系我们</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
