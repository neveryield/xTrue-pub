/**
 * 认证/实人认证模块 - API 调用封装
 */

import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";
import type {
  RealNameCertForm,
  RealPersonCertForm,
  SessionVerifyForm,
  CertificationResponse,
  CertStatusResponse,
  SessionVerifyResponse,
  TrustedCertForm,
} from "./schemas";

/** 实名认证（层级1→2） */
export async function certifyRealName(data: RealNameCertForm): Promise<CertificationResponse> {
  return api.post<CertificationResponse>(API.CERTIFICATIONS.REAL_NAME, data, true);
}

/** 实人认证（层级2→3） */
export async function certifyRealPerson(data: RealPersonCertForm): Promise<CertificationResponse> {
  return api.post<CertificationResponse>(API.CERTIFICATIONS.REAL_PERSON, data, true);
}

/** 本次实人验证 — 会话状态（层级3+，大V自动跳过） */
export async function verifySession(data: SessionVerifyForm): Promise<SessionVerifyResponse> {
  return api.post<SessionVerifyResponse>(API.CERTIFICATIONS.SESSION_VERIFY, data, true);
}

/** 提交可信用户认证（层级3→5） */
export async function certifyTrusted(data: TrustedCertForm): Promise<CertificationResponse> {
  return api.post<CertificationResponse>(API.CERTIFICATIONS.TRUSTED, data, true);
}

/** 查询认证状态概览 */
export async function getCertStatus(): Promise<CertStatusResponse> {
  return api.get<CertStatusResponse>(API.CERTIFICATIONS.STATUS, true);
}
