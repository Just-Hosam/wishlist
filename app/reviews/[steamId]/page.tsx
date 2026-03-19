import { ExpandableText } from "@/components/ui/expandable-text"
import { cn, formatReleaseDate, tryCatch } from "@/lib/utils"
import { getCachedSteamReviews } from "@/server/actions/reviews"
import { SteamReview } from "@/types/reviews"
import { Check, Star, X } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ steamId: string }>
}

export default async function SteamReviewsPage({ params }: Props) {
  const { steamId } = await params
  if (!steamId) notFound()

  const { data, error } = await tryCatch(getCachedSteamReviews(steamId))
  if (error) notFound()

  const starRatio =
    Math.round((Math.abs(data.positive / data.total) * 100) / 2) / 10

  if (Number.isNaN(starRatio)) {
    console.error("Error calculating Steam star ratio:", data)
    return null
  }

  return (
    <div className="custom-slide-up-fade-in">
      <div className="flex items-baseline gap-3">
        <h2 className="text-7xl font-bold">{starRatio}</h2>
        <Star className="mr-1 size-9 fill-[#fbc113] text-[#fbc113]" />
      </div>
      <p className="mt-1 pl-2 text-lg text-muted-foreground">
        {data.total} reviews
      </p>

      <div className="mt-6 space-y-4">
        {data.reviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>
    </div>
  )
}

function Review(review: SteamReview) {
  return (
    <div
      className={cn(
        "rounded-[2rem] bg-card px-5 py-[18px] shadow-sm",
        review.recommended ? "shadow-green-600" : "shadow-red-600"
      )}
    >
      <header className="flex items-center gap-3">
        <div
          className={cn(
            "rounded-full p-2 text-accent-foreground",
            review.recommended ? "bg-green-600" : "bg-red-600"
          )}
        >
          {review.recommended ? <Check /> : <X />}
        </div>
        <div>
          <p className="font-semibold">{review.username}</p>
          {review.date && (
            <p className="mt-[1px] text-xs text-muted-foreground">
              {formatReleaseDate(review.date)}
            </p>
          )}
        </div>
      </header>
      <ExpandableText
        text={review.message}
        className="mt-4 text-sm text-muted-foreground"
        lineClamp={6}
      />
    </div>
  )
}
