import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="custom-slide-fade-in grid gap-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex overflow-hidden rounded-3xl border">
          {/* Game cover skeleton */}
          <Skeleton className="h-[174px] w-[130px] flex-shrink-0" />

          <div className="flex min-w-0 flex-1 flex-col px-4 py-3">
            <header className="items-start justify-between">
              {/* Title skeleton */}
              <Skeleton className="mb-1 h-6 w-3/4" />
              {/* Time info skeleton */}
              <Skeleton className="h-4 w-20" />
            </header>

            <div className="mt-auto flex flex-col gap-1 pt-3">
              {/* Price skeletons */}
              <div className="flex items-center">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
