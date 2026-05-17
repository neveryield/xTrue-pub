/** 产品详情页 — 已废弃，重定向到帖子详情页 /posts/[id] */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.replace(`/posts/${id}`);
  }, [router, id]);

  return null;
}
