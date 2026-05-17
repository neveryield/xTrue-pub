import { z } from "zod";

export type AdminMe = {
  user_id: number;
  user_level: number;
  is_staff: boolean;
};

export const adminMeSchema = z.object({
  user_id: z.number(),
  user_level: z.number(),
  is_staff: z.boolean(),
});

export type AdminBlacklistItem = {
  blacklist_id: number;
  target_type: string;
  target_value: string;
  reason: string | null;
  expired_at: string | null;
  status: number;
  created_at: string;
};

export type PaginatedBlacklist = {
  items: AdminBlacklistItem[];
  total: number;
  offset: number;
  limit: number;
};

export type AdminRiskEventItem = {
  event_id: number;
  user_id: number;
  event_type: string;
  risk_level: string;
  risk_score: number;
  rule_hit: string | null;
  decision: string;
  created_at: string;
};

export type PaginatedRiskEvents = {
  items: AdminRiskEventItem[];
  total: number;
  offset: number;
  limit: number;
};

export type AdminUserRow = {
  user_id: number;
  nickname: string | null;
  user_level: number;
  status: number;
  credibility: number;
  registered_at: string;
};

export type PaginatedUsers = {
  items: AdminUserRow[];
  total: number;
  offset: number;
  limit: number;
};

export type AdminReviewRow = {
  review_id: number;
  user_id: number;
  product_id: number;
  score: number;
  content: string | null;
  status: number;
  helpful_count: number;
  created_at: string;
};

export type PaginatedReviews = {
  items: AdminReviewRow[];
  total: number;
  offset: number;
  limit: number;
};

export type CertificationQueueItem = {
  cert_id: number;
  user_id: number;
  cert_type: string;
  status: string;
  created_at: string;
};

export type CertificationQueueResponse = {
  items: CertificationQueueItem[];
  total: number;
};

export type ArbitrationPlaceholder = {
  enabled: boolean;
  message: string;
};
