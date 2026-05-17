"use client";

import { useAdminArbitration } from "@/modules/admin-console/hooks";

export default function AdminArbitrationPage() {
  const { data, isLoading } = useAdminArbitration();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">仲裁</h1>
      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
          <p>enabled: {String(data?.enabled)}</p>
          <p className="mt-2 text-slate-400">{data?.message}</p>
        </div>
      )}
    </div>
  );
}
