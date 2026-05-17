/**
 * 权限工具函数 — 基于用户层级的权限判断
 */

/** 是否可打分（层级 >= 2） */
export function canScore(level: number): boolean {
  return level >= 2;
}

/** 是否可评论（层级 >= 3） */
export function canComment(level: number): boolean {
  return level >= 3;
}

/** 是否可发帖/写评价（层级 >= 4） */
export function canPost(level: number): boolean {
  return level >= 4;
}

/** 是否可跳过当次验证（大V，层级 >= 5） */
export function canSkipVerification(level: number): boolean {
  return level >= 5;
}

/** 是否需要当次验证才能发帖（层级 === 4） */
export function needsSessionVerify(level: number): boolean {
  return level === 4;
}
