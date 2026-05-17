"use client";

import { useAdminCertificationsPending } from "@/modules/admin-console/hooks";

export default function AdminCertificationsPage() {
  const { data, isLoading } = useAdminCertificationsPending();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">认证队列（待审）</h1>
      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-2">cert_id</th>
                <th className="p-2">user_id</th>
                <th className="p-2">类型</th>
                <th className="p-2">状态</th>
                <th className="p-2">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.cert_id} className="border-t border-slate-800">
                  <td className="p-2">{row.cert_id}</td>
                  <td className="p-2">{row.user_id}</td>
                  <td className="p-2">{row.cert_type}</td>
                  <td className="p-2">{row.status}</td>
                  <td className="p-2">{new Date(row.created_at).toLocaleString("zh-CN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-800 p-2 text-xs text-slate-500">共 {data?.total ?? 0} 条待审（只读）</p>
        </div>
      )}
    </div>
  );
}
