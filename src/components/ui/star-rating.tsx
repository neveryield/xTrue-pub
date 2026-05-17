/** StarRating 星级评分组件 */

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

export function StarRating({
  score,
  maxScore = 5,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: maxScore }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < score
              ? "fill-star text-star"
              : "fill-none text-muted-foreground/30",
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-star">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}
