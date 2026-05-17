/**
 * 认证模块 - React Query Hooks
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "./store";
import { getDeviceId } from "@/lib/utils";
import * as authApi from "./api";
import type { LoginForm, RegisterForm, SmsLoginForm } from "./schemas";

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      return authApi.login({
        account: data.account.trim(),
        password: data.password,
        device_id: getDeviceId(),
      });
    },
    onSuccess: (data) => {
      const userId = parseInt(data.user_id, 10);
      login({ userId, nickname: null, userLevel: data.user_level });
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      return authApi.register({
        account: data.account.trim(),
        password: data.password,
        device_id: getDeviceId(),
      });
    },
    onSuccess: (data) => {
      const userId = parseInt(data.user_id, 10);
      login({ userId, nickname: null, userLevel: data.user_level });
    },
  });
}

export function useSendSmsCode() {
  return useMutation({
    mutationFn: (phone: string) => authApi.sendSmsCode(phone.trim()),
  });
}

export function useLoginSms() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SmsLoginForm) => {
      return authApi.loginSms({
        phone: data.phone.trim(),
        code: data.code.trim(),
        device_id: getDeviceId(),
      });
    },
    onSuccess: (data) => {
      const userId = parseInt(data.user_id, 10);
      login({ userId, nickname: null, userLevel: data.user_level });
    },
  });
}

export function useLogout() {
  const { logout: storeLogout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      storeLogout();
    },
    onError: () => {
      storeLogout();
    },
  });
}

/** 获取当前用户有效层级 */
export function useEffectiveLevel(): number {
  const { effectiveLevel } = useAuthStore();
  return effectiveLevel;
}
