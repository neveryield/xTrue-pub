"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminReviewStatus, useAdminReviews } from "@/modules/admin-console/hooks";

export default function AdminReviewsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const pid = productId.trim() ? parseInt(productId, 10) : undefined;
  const uid = userId.trim() ? parseInt(userId, 10) : undefined;
  const st = statusFilter.trim() ? parseInt(statusFilter, 10) : undefined;

  const filters = {
    ...(Number.isFinite(pid) ? { product_id: pid } : {}),
    ...(Number.isFinite(uid) ? { user_id: uid } : {}),
    ...(Number.isFinite(st) ? { status: st } : {}),
  };

  const { data, isLoading } = useAdminReviews(offset, limit, filters);
  const statusMut = useAdminReviewStatus();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">评价</h1>

      <div className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:grid-cols-3">
        <div>
          <Label className="text-slate-400">product_id</Label>
          <Input
            className="mt-1 border-slate-700 bg-slate-950 text-slate-200"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-slate-400">user_id</Label>
          <Input
            className="mt-1 border-slate-700 bg-slate-950 text-slate-200"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-slate-400">status (1/2/3)</Label>
          <Input
            className="mt-1 border-slate-700 bg-slate-950 text-slate-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">加载中…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-2">review_id</th>
                <th className="p-2">product</th>
                <th className="p-2">user</th>
                <th className="p-2">分</th>
                <th className="p-2">状态</th>
                <th className="p-2">内容</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.review_id} className="border-t border-slate-800">
                  <td className="p-2">{row.review_id}</td>
                  <td className="p-2">{row.product_id}</td>
                  <td className="p-2">{row.user_id}</td>
                  <td className="p-2">{row.score}</td>
                  <td className="p-2">{row.status}</td>
                  <td className="max-w-xs truncate p-2">{row.content ?? "—"}</td>
                  <td className="p-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px]"
                      disabled={statusMut.isPending || row.status === 3}
                      onClick={() => statusMut.mutate({ reviewId: row.review_id, status: 3 })}
                    >
                      隐藏
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
