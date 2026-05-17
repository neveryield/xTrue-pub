/** 产品列表页 — 已废弃，重定向到首页 / */
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProductsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    const keyword = searchParams.get("keyword");
    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }, [router, searchParams]);

  return null;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsRedirect />
    </Suspense>
  );
}
