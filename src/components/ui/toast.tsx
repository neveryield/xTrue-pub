/**
 * shadcn/ui Toast 组件（基于 sonner 封装）
 * @see https://ui.shadcn.com/docs/components/toast
 */

"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import type { ToasterProps } from "sonner";

/** 全局 Toast 容器，需在 layout 中引入一次 */
export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast };
