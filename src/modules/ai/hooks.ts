/**
 * AI 辅助模块 — React Query hooks
 */

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";

interface FormatResponse {
  formatted: string;
}

interface ComplianceIssue {
  pattern: string;
  message: string;
}

interface ComplianceCheckResponse {
  passed: boolean;
  issues: ComplianceIssue[];
}

async function formatContent(content: string): Promise<FormatResponse> {
  return api.post<FormatResponse>(API.AI.FORMAT, { content }, true);
}

async function checkCompliance(content: string): Promise<ComplianceCheckResponse> {
  return api.post<ComplianceCheckResponse>(API.AI.COMPLIANCE_CHECK, { content }, true);
}

export function useFormatContent() {
  return useMutation({ mutationFn: formatContent });
}

export function useComplianceCheck() {
  return useMutation({ mutationFn: checkCompliance });
}
