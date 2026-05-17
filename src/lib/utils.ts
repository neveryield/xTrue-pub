import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui utility: merge Tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Same-origin path only — for post-login `redirect` query param.
 * Blocks open redirects (`//evil.com`, `https://...`, etc.).
 */
const DEVICE_ID_KEY = "xdevice_id";

/** 获取或生成设备ID（持久化到 localStorage） */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getSafeInternalRedirect(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return fallback;
  if (/^[a-zA-Z][\w+.-]*:/.test(t)) return fallback;
  return t;
}
