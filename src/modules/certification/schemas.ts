/**
 * 认证/实人认证模块 - 类型定义与校验
 */

import { z } from "zod";

// ---------- 请求校验 ----------

export const realNameCertSchema = z.object({
  real_name: z.string().min(2, "姓名至少2个字符").max(20, "姓名最多20个字符"),
  id_card: z.string().min(15, "身份证号格式不正确").max(18, "身份证号格式不正确"),
});

export const realPersonCertSchema = z.object({
  verify_token: z.string().min(1, "验证凭证不能为空"),
});

export const sessionVerifySchema = z.object({
  verify_token: z.string().min(1, "验证凭证不能为空"),
});

export const trustedCertSchema = z.object({
  real_name: z.string().min(2).max(20),
  face_video: z.string().min(1, "人脸视频凭证不能为空"),
  sesame_score: z.number().int().min(350).max(950).optional(),
  wechat_verified: z.boolean().optional(),
  alipay_verified: z.boolean().optional(),
  documents: z.array(z.string()).max(10).default([]),
});

// ---------- 类型 ----------

export type RealNameCertForm = z.infer<typeof realNameCertSchema>;
export type RealPersonCertForm = z.infer<typeof realPersonCertSchema>;
export type SessionVerifyForm = z.infer<typeof sessionVerifySchema>;
export type TrustedCertForm = z.infer<typeof trustedCertSchema>;

/** 认证记录响应 */
export interface CertificationResponse {
  cert_id: number;
  user_id: number;
  cert_type: string;
  status: string;
  verified_at: string | null;
  failure_reason: string | null;
  created_at: string;
}

/** 用户认证状态概览 */
export interface CertStatusResponse {
  user_id: number;
  user_level: number;
  effective_level: number;
  real_name_verified: boolean;
  real_person_verified: boolean;
  session_verified: boolean;
  session_verified_at: string | null;
}

/** 本次实人验证结果 */
export interface SessionVerifyResponse {
  verified: boolean;
  effective_level: number;
  expires_at: string | null;
}
