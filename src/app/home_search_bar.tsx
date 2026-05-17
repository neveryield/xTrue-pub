"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export interface HomeSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
  placeholder?: string;
  variant?: "default" | "glass";
}

export function HomeSearchBar({
  value,
  onChange,
  onSearch,
  loading,
  placeholder = "搜索真实体验...",
  variant = "default",
}: HomeSearchBarProps) {
  const [focused, setFocused] = useState(false);

  if (variant === "glass") {
    return (
      <div className="mx-auto mt-6 flex max-w-md gap-0 overflow-hidden rounded-2xl bg-white/[0.12] p-1.5 shadow-lg shadow-emerald-900/5 backdrop-blur-xl ring-1 ring-white/20">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-11 w-full rounded-xl bg-transparent pl-10 pr-4 text-[15px] text-white placeholder-white/35 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-white/95 active:scale-[0.97]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mb-8 max-w-xl">
      <div
        className={`flex items-center overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
          focused
            ? "border-amber-300/60 shadow-[0_0_0_4px_rgba(212,162,78,0.08)]"
            : "border-[#E8E3DA] hover:border-amber-200/50"
        }`}
      >
        <div className="flex h-[52px] flex-1 items-center gap-2.5 pl-5">
          <Search className="h-[18px] w-[18px] shrink-0 text-[#B8B0A4]" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-full w-full bg-transparent pr-4 text-[15px] text-[#1E1B18] placeholder-[#C4BCB0] outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => { onChange(""); onSearch(); }}
              className="mr-1 rounded-full p-1 text-[#C4BCB0] hover:bg-[#F5F2EC] hover:text-[#8B8478] transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
        <div className="h-6 w-[1px] bg-[#E8E3DA]" />
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="flex h-[52px] shrink-0 items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 text-sm font-semibold text-amber-700 transition-all hover:from-amber-100 hover:to-orange-100 active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          搜索
        </button>
      </div>
    </div>
  );
}
