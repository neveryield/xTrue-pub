"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminUserLevel, useAdminUsers, useAdminUserStatus } from "@/modules/admin-console/hooks";

const STATUS_LABEL: Record<number, string> = { 1: "正常", 2: "警告", 3: "封禁" };

export default function AdminUsersPage() {
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const limit = 20;
  const { data, isLoading } = useAdminUsers(offset, limit, q);
  const statusMut = useAdminUserStatus();
  const levelMut = useAdminUserLevel();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">用户</h1>

      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQ(qInput.trim());
          setOffset(0);
        }}
      >
        <div>
          <Label className="text-slate-400">昵称搜索</Label>
          <Input
            className="mt-1 w-48 border-slate-700 bg-slate-950 text-slate-200"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" variant="secondary">
          搜索
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-2">user_id</th>
                <th className="p-2">昵称</th>
                <th className="p-2">层级</th>
                <th className="p-2">状态</th>
                <th className="p-2">信誉</th>
                <th className="p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.user_id} className="border-t border-slate-800">
                  <td className="p-2">{row.user_id}</td>
                  <td className="p-2">{row.nickname ?? "—"}</td>
                  <td className="p-2">{row.user_level}</td>
                  <td className="p-2">{STATUS_LABEL[row.status] ?? row.status}</td>
                  <td className="p-2">{row.credibility.toFixed(2)}</td>
                  <td className="p-2 space-x-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px]"
                      disabled={statusMut.isPending}
                      onClick={() => statusMut.mutate({ userId: row.user_id, status: 3 })}
                    >
                      封禁
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px]"
                      disabled={statusMut.isPending}
                      onClick={() => statusMut.mutate({ userId: row.user_id, status: 1 })}
                    >
                      解封
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[10px]"
                      disabled={levelMut.isPending || row.user_level === 5}
                      onClick={() => levelMut.mutate({ userId: row.user_id, user_level: 5 })}
                    >
                      设为大V
                    </Button>
                  </td>
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
