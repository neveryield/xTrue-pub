"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminRiskEvents } from "@/modules/admin-console/hooks";

export default function AdminRiskEventsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isLoading } = useAdminRiskEvents(offset, limit);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">风控事件</h1>
      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-2">event_id</th>
                <th className="p-2">user_id</th>
                <th className="p-2">类型</th>
                <th className="p-2">等级</th>
                <th className="p-2">分数</th>
                <th className="p-2">决策</th>
                <th className="p-2">规则</th>
                <th className="p-2">时间</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.event_id} className="border-t border-slate-800">
                  <td className="p-2">{row.event_id}</td>
                  <td className="p-2">{row.user_id}</td>
                  <td className="p-2">{row.event_type}</td>
                  <td className="p-2">{row.risk_level}</td>
                  <td className="p-2">{row.risk_score}</td>
                  <td className="p-2">{row.decision}</td>
                  <td className="p-2">{row.rule_hit ?? "—"}</td>
                  <td className="p-2 whitespace-nowrap">{new Date(row.created_at).toLocaleString("zh-CN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-800 p-2 text-xs text-slate-500">
            <span>共 {data?.total ?? 0} 条</span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - limit))}>
                上一页
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!data || offset + limit >= data.total}
                onClick={() => setOffset((o) => o + limit)}
              >
                下一页
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
