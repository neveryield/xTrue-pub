/**
 * API 客户端封装 — httpOnly Cookie 自动鉴权 + 401 刷新 + 全局错误 Toast
 */

import { toast } from "sonner";
import { API } from "./api-endpoints";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** 根据 HTTP 状态码返回友好错误提示 */
function getErrorMessage(status: number, fallback: string): string {
  const map: Record<number, string> = {
    0: "网络异常，请检查连接后重试",
    400: "请求参数有误",
    401: "登录已过期，请重新登录",
    403: "权限不足，无法执行此操作",
    404: "请求的资源不存在",
    409: "数据冲突，请刷新后重试",
    422: "提交数据校验失败",
    429: "操作过于频繁，请稍后再试",
    500: "服务器内部错误，请稍后再试",
    502: "服务暂时不可用，请稍后再试",
    503: "服务维护中，请稍后再试",
  };
  return map[status] ?? fallback;
}

/** 解析响应 JSON，失败时返回空对象 */
async function safeParseJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * 是否弹出全局 Toast：5xx/429/403/404；401 仅在非 auth 请求时提示（auth 请求走刷新或跳转登录）。
 * 400/422 交给表单内联错误，避免与 mutation 提示重复。
 */
function shouldToastHttpStatus(status: number, isAuthRequest: boolean): boolean {
  if (status === 0) return true;
  if (status >= 500 || status === 429) return true;
  if (status === 403 || status === 404) return true;
  if (status === 401 && !isAuthRequest) return true;
  return false;
}

function maybeToastError(status: number, message: string, isAuthRequest: boolean): void {
  if (typeof window === "undefined") return;
  if (!shouldToastHttpStatus(status, isAuthRequest)) return;
  const title = getErrorMessage(status, message);
  toast(title, { description: message !== title ? message : undefined });
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** 是否附加认证 Cookie（默认 false） */
  auth?: boolean;
  /** 额外请求参数 */
  params?: Record<string, string | number>;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string | number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** 拼接 query string */
function buildQueryString(params?: Record<string, string | number>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

/** 尝试通过 refresh cookie 刷新 Token */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}${API.AUTH.REFRESH}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = false, params } = options;
  const qs = buildQueryString(params);
  const url = `${API_URL}${path}${qs}`;

  const fetchInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: auth ? "include" : "same-origin",
  };

  let response: Response;
  try {
    response = await fetch(url, fetchInit);
  } catch {
    maybeToastError(0, "网络异常，请检查连接后重试", auth);
    throw new ApiError(0, "NETWORK", "网络异常，请检查连接后重试");
  }

  // 401 时尝试刷新 Token 重试一次
  if (response.status === 401 && auth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      let retryResponse: Response;
      try {
        retryResponse = await fetch(url, fetchInit);
      } catch {
        maybeToastError(0, "网络异常，请检查连接后重试", auth);
        throw new ApiError(0, "NETWORK", "网络异常，请检查连接后重试");
      }
      if (!retryResponse.ok) {
        const err = await safeParseJson(retryResponse);
        const message = (err.message as string) ?? "请求失败";
        maybeToastError(retryResponse.status, message, auth);
        throw new ApiError(
          retryResponse.status,
          (err.code as string | number) ?? "UNKNOWN",
          message,
        );
      }
      if (retryResponse.status === 204) return undefined as T;
      return retryResponse.json() as Promise<T>;
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/auth?tab=login";
      }
      throw new ApiError(401, "UNAUTHORIZED", "登录已过期，请重新登录");
    }
  }

  if (!response.ok) {
    const err = await safeParseJson(response);
    const message = (err.message as string) ?? "请求失败";
    maybeToastError(response.status, message, auth);
    throw new ApiError(
      response.status,
      (err.code as string | number) ?? "UNKNOWN",
      message,
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  try {
    return (await response.json()) as T;
  } catch {
    maybeToastError(502, "响应格式异常", auth);
    throw new ApiError(502, "INVALID_JSON", "响应格式异常");
  }
}

async function uploadRequest<T>(path: string, formData: FormData, auth: boolean): Promise<T> {
  const url = `${API_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {},
      body: formData,
      credentials: auth ? "include" : "same-origin",
    });
  } catch {
    maybeToastError(0, "网络异常，请检查连接后重试", auth);
    throw new ApiError(0, "NETWORK", "网络异常，请检查连接后重试");
  }

  if (!response.ok) {
    const err = await safeParseJson(response);
    const message = (err.message as string) ?? (err.detail as string) ?? "上传失败";
    maybeToastError(response.status, message, auth);
    throw new ApiError(response.status, (err.code as string | number) ?? "UNKNOWN", message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, auth?: boolean, params?: Record<string, string | number>) =>
    request<T>(path, { auth, params }),
  post: <T>(path: string, body?: unknown, auth?: boolean) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body: unknown, auth?: boolean) =>
    request<T>(path, { method: "PUT", body, auth }),
  delete: <T>(path: string, auth?: boolean) =>
    request<T>(path, { method: "DELETE", auth }),
  upload: <T>(path: string, formData: FormData, auth?: boolean) =>
    uploadRequest<T>(path, formData, auth ?? false),
};

export { ApiError };
