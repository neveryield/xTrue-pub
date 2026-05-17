/**
 * 认证/实人认证模块 - React Query Hooks
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/store";
import * as certApi from "./api";
import type { RealNameCertForm, RealPersonCertForm, SessionVerifyForm } from "./schemas";

/** 实名认证 */
export function useCertifyRealName() {
  const queryClient = useQueryClient();
  const { setUser, setEffectiveLevel } = useAuthStore();

  return useMutation({
    mutationFn: certApi.certifyRealName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certStatus"] });
      // 实名认证成功后层级变为2，更新 store
      setUser(useAuthStore.getState().user!);
      setEffectiveLevel(2);
    },
  });
}

/** 实人认证 */
export function useCertifyRealPerson() {
  const queryClient = useQueryClient();
  const { setUser, setEffectiveLevel } = useAuthStore();

  return useMutation({
    mutationFn: certApi.certifyRealPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certStatus"] });
      setUser(useAuthStore.getState().user!);
      setEffectiveLevel(3);
    },
  });
}

/** 本次实人验证 */
export function useVerifySession() {
  const queryClient = useQueryClient();
  const { setEffectiveLevel } = useAuthStore();

  return useMutation({
    mutationFn: certApi.verifySession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certStatus"] });
      setEffectiveLevel(data.effective_level);
    },
  });
}

/** 查询认证状态 */
export function useCertStatus() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["certStatus"],
    queryFn: certApi.getCertStatus,
    enabled: isAuthenticated,
  });
}
