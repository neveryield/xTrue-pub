"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAddBlacklist, useAdminBlacklist, useAdminRemoveBlacklist } from "@/modules/admin-console/hooks";

export default function AdminBlacklistPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isLoading } = useAdminBlacklist(offset, limit);
  const addMut = useAdminAddBlacklist();
  const delMut = useAdminRemoveBlacklist();

  const [targetType, setTargetType] = useState("user");
  const [targetValue, setTargetValue] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-100">黑名单</h1>

      <form
        className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!targetValue.trim()) return;
          addMut.mutate(
            { target_type: targetType, target_value: targetValue.trim(), reason: reason || null },
            { onSuccess: () => { setTargetValue(""); setReason(""); } },
          );
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="text-slate-400">类型</Label>
            <select
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
            >
              <option value="user">user</option>
              <option value="device">device</option>
              <option value="ip">ip</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-400">目标值</Label>
            <Input
              className="mt-1 border-slate-700 bg-slate-950 text-slate-200"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="user_id / 设备指纹 / IP"
            />
          </div>
          <div>
            <Label className="text-slate-400">原因（可选）</Label>
            <Input
              className="mt-1 border-slate-700 bg-slate-950 text-slate-200"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" size="sm" disabled={addMut.isPending}>
          {addMut.isPending ? "提交中…" : "加入黑名单"}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">类型</th>
                <th className="p-2">值</th>
                <th className="p-2">原因</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.blacklist_id} className="border-t border-slate-800">
                  <td className="p-2">{row.blacklist_id}</td>
                  <td className="p-2">{row.target_type}</td>
                  <td className="p-2 font-mono">{row.target_value}</td>
                  <td className="p-2">{row.reason ?? "—"}</td>
                  <td className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300"
                      disabled={delMut.isPending}
                      onClick={() => delMut.mutate(row.blacklist_id)}
                    >
                      移除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-800 p-2 text-xs text-slate-500">
            <span>共 {data?.total ?? 0} 条</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - limit))}
              >
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
