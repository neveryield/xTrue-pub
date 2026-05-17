/**
 * 全局导航栏组件 — xTrue 暖风设计
 * 导航：首页 | 餐饮 | 游乐 | 影音 | 器物 | 随谈
 * 品类菜单点击跳转 /?category=xxx，在首页按品类筛选
 * 字体：Fredoka (font-display) 统一菜单视觉
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { ROUTES, USER_LEVEL, CATEGORIES } from "@/lib/constants";
import { Menu, X, User, LogOut, ShieldCheck, PenLine, ChevronDown, Award, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "";
  const { isAuthenticated, user, userLevel, logout, restore } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    restore();
  }, [restore]);

  const levelInfo = USER_LEVEL[userLevel as keyof typeof USER_LEVEL];

  if (pathname.startsWith("/xtrue-admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-white shadow-md shadow-brand-500/25 font-display">
            x
          </div>
          <span className="text-lg font-bold tracking-wide font-display">xTrue</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 text-sm font-medium font-display tracking-wide md:flex">
          <Link
            href={ROUTES.HOME}
            className={`rounded-lg px-3 py-2 transition-colors ${
              pathname === "/" && !currentCategory
                ? "bg-brand-50 text-brand-600 font-semibold"
                : "text-slate-500 hover:bg-gray-50 hover:text-foreground"
            }`}
          >
            首页
          </Link>
          {CATEGORIES.map(({ key, label }) => (
            <Link
              key={key}
              href={`/?category=${key}`}
              className={`rounded-lg px-2.5 py-2 transition-colors ${
                currentCategory === key
                  ? "bg-brand-50 text-brand-600 font-semibold"
                  : "text-slate-500 hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Area (Desktop) */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated && user ? (
            <>
              <Link href={ROUTES.POST_NEW}>
                <Button size="sm" className="h-9 gap-1.5 bg-brand-500 text-white hover:bg-brand-600 font-display">
                  <PenLine className="h-4 w-4" />
                  发帖
                </Button>
              </Link>
              {/* 昵称 + Hover 下拉菜单 */}
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-sm font-medium font-display transition-colors hover:bg-brand-50"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[80px] truncate">{user.nickname || `用户${user.userId}`}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown */}
                <div className="invisible absolute right-0 top-full z-50 mt-1.5 min-w-[170px] origin-top-right scale-95 rounded-xl border border-gray-100 bg-white py-1.5 opacity-0 shadow-lg shadow-black/5 transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100 font-display">
                  <Link
                    href={ROUTES.USER_PROFILE(user.userId)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <User className="h-4 w-4" />
                    我的主页
                  </Link>
                  <Link
                    href="/users/me"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Settings className="h-4 w-4" />
                    我的档案
                  </Link>
                  <Link
                    href={ROUTES.CERTIFICATION}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    认证中心
                  </Link>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600">
                    <Award className="h-4 w-4" />
                    <span>等级</span>
                    {levelInfo && (
                      <Badge
                        variant="outline"
                        className={`ml-auto px-1.5 py-0 text-[10px] ${
                          userLevel === 5
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : userLevel === 4
                            ? "border-brand-200 bg-brand-50 text-brand-600"
                            : userLevel === 3
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        {levelInfo.shortLabel}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-foreground"
                title="退出登录"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium font-display text-slate-500 transition-colors hover:text-foreground"
              >
                登录
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm" className="h-9 bg-brand-500 text-white hover:bg-brand-600 font-display">
                  注册
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t md:hidden font-display">
          <div className="space-y-1 px-4 py-3">
            <Link href={ROUTES.HOME} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              首页
            </Link>
            {CATEGORIES.map(({ key, label, icon }) => (
              <Link
                key={key}
                href={`/?category=${key}`}
                className={`block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 ${
                  currentCategory === key ? "bg-brand-50 text-brand-600" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {icon} {label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            {isAuthenticated && user ? (
              <>
                <Link href={ROUTES.POST_NEW} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50" onClick={() => setMenuOpen(false)}>
                  <PenLine className="h-4 w-4" /> 发帖
                </Link>
                <Link href={ROUTES.USER_PROFILE(user.userId)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  我的主页
                  {levelInfo && (
                    <Badge variant="outline" className="ml-2 border-brand-200 bg-brand-50 px-1 py-0 text-[10px] text-brand-600">
                      {levelInfo.shortLabel}
                    </Badge>
                  )}
                </Link>
                <Link href="/users/me" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  <Settings className="h-4 w-4" /> 我的档案
                </Link>
                <Link href={ROUTES.CERTIFICATION} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50" onClick={() => setMenuOpen(false)}>
                  <ShieldCheck className="h-4 w-4" /> 认证中心
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
                  登出
                </button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  登录
                </Link>
                <Link href={ROUTES.REGISTER} className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50" onClick={() => setMenuOpen(false)}>
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
