"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  loading?: boolean;
  onChange: (p: number) => void;
  variant?: "default" | "pill";
}

export function HomePagination({ page, totalPages, loading, onChange, variant = "default" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const baseBtn = "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";

  if (variant === "pill") {
    return (
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page === 0 || loading}
          onClick={() => onChange(page - 1)}
          className={`${baseBtn} rounded-full bg-white px-5 py-2.5 text-[#5C554A] shadow-[0_1px_4px_rgba(0,0,0,0.04)] ring-1 ring-[#E8E3DA]/60 hover:bg-[#FBFAF7] hover:shadow-md hover:ring-amber-200/40 active:scale-[0.97]`}
        >
          <ChevronLeft className="h-4 w-4" />
          上一页
        </button>

        <span className="min-w-[80px] text-center text-[13px] tabular-nums tracking-wide text-[#B8B0A4]">
          {page + 1} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages - 1 || loading}
          onClick={() => onChange(page + 1)}
          className={`${baseBtn} rounded-full bg-white px-5 py-2.5 text-[#5C554A] shadow-[0_1px_4px_rgba(0,0,0,0.04)] ring-1 ring-[#E8E3DA]/60 hover:bg-[#FBFAF7] hover:shadow-md hover:ring-amber-200/40 active:scale-[0.97]`}
        >
          下一页
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={page === 0 || loading}
        onClick={() => onChange(page - 1)}
        className={`${baseBtn} rounded-xl border border-[#E8E3DA] bg-white px-4 py-2.5 text-[#5C554A] hover:border-amber-200/60 hover:bg-[#FBFAF7] hover:text-[#1E1B18] active:scale-[0.97]`}
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </button>

      <span className="min-w-[80px] text-center text-[13px] tabular-nums tracking-wide text-[#B8B0A4]">
        {page + 1} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages - 1 || loading}
        onClick={() => onChange(page + 1)}
        className={`${baseBtn} rounded-xl border border-[#E8E3DA] bg-white px-4 py-2.5 text-[#5C554A] hover:border-amber-200/60 hover:bg-[#FBFAF7] hover:text-[#1E1B18] active:scale-[0.97]`}
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
