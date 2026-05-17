/** 认证模块 - 类型定义与校验 */

import { z } from "zod";

/** 与后端 app/common/account.py 规则对齐 */
export const accountFieldSchema = z
  .string()
  .min(3, "至少3个字符")
  .max(128)
  .superRefine((val, ctx) => {
    const s = val.trim();
    if (/^1[3-9]\d{9}$/.test(s)) return;
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(s)) return;
    if (/^[a-zA-Z][a-zA-Z0-9_]{2,63}$/.test(s)) return;
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "须为11位大陆手机号、有效邮箱，或以字母开头且仅含字母/数字/下划线的用户名（3–64位）",
    });
  });

export const loginSchema = z.object({
  account: accountFieldSchema,
  password: z.string().min(8, "密码至少8位").max(64),
});

export const smsLoginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入11位手机号"),
  code: z.string().min(4, "请输入验证码").max(8),
});

export const registerSchema = z
  .object({
    account: accountFieldSchema,
    password: z.string().min(8, "密码至少8位").max(64),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type SmsLoginForm = z.infer<typeof smsLoginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

export interface LoginResponse {
  user_id: string;
  user_level: number;
  expires_in: number;
}

export interface SmsSendResponse {
  message: string;
  expires_in: number;
  debug_code?: string | null;
}
