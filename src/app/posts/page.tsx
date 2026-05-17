/**
 * /posts 重定向页 — 已合并到首页
 * 访问 /posts 自动跳转到 /
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
