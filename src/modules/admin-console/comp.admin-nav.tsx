"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links: { href: string; label: string }[] = [
  { href: ADMIN_ROUTES.ROOT, label: "控制台" },
  { href: ADMIN_ROUTES.BLACKLIST, label: "黑名单" },
  { href: ADMIN_ROUTES.RISK_EVENTS, label: "风控事件" },
  { href: ADMIN_ROUTES.USERS, label: "用户" },
  { href: ADMIN_ROUTES.REVIEWS, label: "评价" },
  { href: ADMIN_ROUTES.CERTIFICATIONS, label: "认证队列" },
  { href: ADMIN_ROUTES.ARBITRATION, label: "仲裁" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            pathname === href || (href !== ADMIN_ROUTES.ROOT && pathname.startsWith(href))
              ? "bg-slate-800 text-slate-100"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
