/**
 * 权限守卫组件 — 根据用户层级控制子组件显隐
 */

"use client";

import { type ReactNode } from "react";
import { useAuthStore } from "./store";
import { canScore, canComment, canPost } from "./permissions";

interface PermissionGuardProps {
  children: ReactNode;
  /** 需要打分权限（层级 >= 2） */
  requireScore?: boolean;
  /** 需要评论权限（层级 >= 3） */
  requireComment?: boolean;
  /** 需要发帖权限（层级 >= 4） */
  requirePost?: boolean;
  /** 需要登录（层级 >= 1） */
  requireAuth?: boolean;
  /** 权限不足时的替代内容 */
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  requireScore,
  requireComment,
  requirePost,
  requireAuth,
  fallback = null,
}: PermissionGuardProps) {
  const { isAuthenticated, effectiveLevel } = useAuthStore();

  let hasPermission = true;

  if (requireAuth && !isAuthenticated) hasPermission = false;
  if (requireScore && !canScore(effectiveLevel)) hasPermission = false;
  if (requireComment && !canComment(effectiveLevel)) hasPermission = false;
  if (requirePost && !canPost(effectiveLevel)) hasPermission = false;

  return <>{hasPermission ? children : fallback}</>;
}
