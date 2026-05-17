/**
 * 认证模块 - API 调用封装
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type { LoginResponse, SmsSendResponse } from "./schemas";

export async function register(data: {
  account: string;
  password: string;
  device_id?: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>(API.AUTH.REGISTER, data);
}

export async function login(data: {
  account: string;
  password: string;
  device_id?: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>(API.AUTH.LOGIN, data);
}

export async function sendSmsCode(phone: string): Promise<SmsSendResponse> {
  return api.post<SmsSendResponse>(API.AUTH.SMS_SEND, { phone });
}

export async function loginSms(data: {
  phone: string;
  code: string;
  device_id?: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>(API.AUTH.SMS_LOGIN, data);
}

export async function refreshToken(): Promise<LoginResponse> {
  return api.post<LoginResponse>(API.AUTH.REFRESH, undefined, true);
}

export async function logout(): Promise<{ message: string }> {
  return api.post<{ message: string }>(API.AUTH.LOGOUT, undefined, true);
}

/** 修改密码（L1） */
export async function changePassword(data: {
  old_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return api.put<{ message: string }>(API.AUTH.PASSWORD, data, true);
}

/** 获取登录会话列表（L1） */
export async function listSessions(): Promise<{
  items: { session_id: string; current: boolean; last_seen_at: string | null }[];
}> {
  return api.get(API.AUTH.SESSIONS, true);
}

/** 踢出指定会话（L1） */
export async function deleteSession(sessionId: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(API.AUTH.SESSION(sessionId), true);
}
