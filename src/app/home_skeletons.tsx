import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E3DA]/60 bg-white">
      {/* Left stripe */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-[#F0EDE7]" />
      <div className={`${tall ? "p-6" : "p-5"} pl-5 space-y-3`}>
        <Skeleton className="h-[18px] w-16 rounded-md bg-[#F0EDE7]" />
        <Skeleton className={`rounded-md bg-[#F0EDE7] ${tall ? "h-[24px] w-3/4" : "h-[20px] w-3/4"}`} />
        <Skeleton className="h-[15px] w-full rounded-md bg-[#F5F2EC]" />
        <Skeleton className={`rounded-md bg-[#F5F2EC] ${tall ? "h-[15px] w-2/3" : "h-[15px] w-5/6"}`} />
        {tall && (
          <>
            <Skeleton className="h-[15px] w-full rounded-md bg-[#F5F2EC]" />
            <Skeleton className="h-[15px] w-3/4 rounded-md bg-[#F5F2EC]" />
          </>
        )}
        <div className={`flex items-center justify-between ${tall ? "pt-4" : "pt-3.5"}`}
          style={{ borderTop: "1px solid #F0EDE7" }}>
          <Skeleton className="h-[14px] w-16 rounded-md bg-[#F5F2EC]" />
          <Skeleton className="h-10 w-10 rounded-full bg-[#F0EDE7]" />
        </div>
      </div>
    </div>
  );
}

function SpotlightSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E3DA]/60 bg-white sm:col-span-2">
      <div className="h-[4px] w-full bg-[#F0EDE7]" />
      <div className="flex flex-col gap-6 p-6 md:flex-row md:p-7">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-[18px] w-20 rounded-md bg-[#F0EDE7]" />
          <Skeleton className="h-[28px] w-4/5 rounded-md bg-[#F0EDE7]" />
          <Skeleton className="h-[15px] w-full rounded-md bg-[#F5F2EC]" />
          <Skeleton className="h-[15px] w-2/3 rounded-md bg-[#F5F2EC]" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-12 w-12 rounded-full bg-[#F0EDE7]" />
            <Skeleton className="h-[14px] w-20 rounded-md bg-[#F5F2EC]" />
          </div>
        </div>
        <div className="hidden md:block md:w-[180px]">
          <Skeleton className="h-full min-h-[100px] w-full rounded-xl bg-[#F5F2EC]" />
        </div>
      </div>
    </div>
  );
}

export function HomeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SpotlightSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton tall />
      <CardSkeleton />
    </div>
  );
}

export function LeisureMasonrySkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[#D8E8DF]/60 bg-white p-4">
          <div className="absolute left-0 top-0 h-full w-[3px] bg-emerald-100" />
          <div className="pl-1 space-y-3">
            <Skeleton className="h-[18px] w-20 rounded-md bg-[#EDF5F0]" />
            <Skeleton className="h-[20px] w-3/4 rounded-md bg-[#F0F7F3]" />
            <Skeleton className="h-[15px] w-full rounded-md bg-[#F5F9F7]" />
            <Skeleton className="h-[15px] w-2/3 rounded-md bg-[#F5F9F7]" />
            <Skeleton className="h-[12px] w-12 rounded-md bg-[#F0F7F3]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="bg-[#FBFAF7]">
      {/* Hero skeleton */}
      <div className="pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 space-y-5">
          <Skeleton className="h-6 w-32 rounded-full bg-[#F0EDE7]" />
          <Skeleton className="h-20 w-[600px] max-w-full rounded-xl bg-[#F0EDE7]" />
          <Skeleton className="h-5 w-[300px] max-w-full rounded-lg bg-[#F5F2EC]" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-6 w-16 rounded-full bg-[#F0EDE7]" />
            <Skeleton className="h-6 w-16 rounded-full bg-[#F0EDE7]" />
            <Skeleton className="h-6 w-16 rounded-full bg-[#F0EDE7]" />
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-5">
          <Skeleton className="mx-auto mb-8 h-[52px] w-full max-w-xl rounded-2xl bg-[#F0EDE7]" />
          <HomeGridSkeleton />
        </div>
      </div>
    </div>
  );
}
