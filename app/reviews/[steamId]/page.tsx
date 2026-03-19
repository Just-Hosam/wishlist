import { Button } from "@/components/ui/button"
import { ExpandableText } from "@/components/ui/expandable-text"
import { buildSteamStorePageUrl } from "@/lib/igdb-store-links"
import { cn, formatReleaseDate, tryCatch } from "@/lib/utils"
import { getCachedSteamReviews } from "@/server/actions/reviews"
import { SteamReview } from "@/types/reviews"
import { Check, ExternalLink, Info, Star, X } from "lucide-react"
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

  const steamReviewsUrl = buildSteamStorePageUrl(
    steamId,
    "CA",
    "app_review_hash"
  )
  if (!steamReviewsUrl) notFound()

  return (
    <div className="custom-slide-up-fade-in">
      <div className="flex items-baseline gap-3">
        <h2 className="text-7xl font-bold">{starRatio}</h2>
        <Star className="mr-1 size-9 fill-[#fbc113] text-[#fbc113]" />
      </div>
      <a
        href={steamReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex w-fit items-center gap-2 px-2 text-lg text-muted-foreground hover:opacity-90"
      >
        <p>{data.total} reviews</p>
        <ExternalLink className="size-4" />
      </a>

      <div className="mt-6 space-y-4">
        {data.reviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>
      <div className="mt-6 flex gap-2 rounded-2xl px-2 text-muted-foreground">
        <Info className="mt-[3px] size-[18px]" />
        <p className="flex-1 text-sm">
          Only 20 reviews are being shown. Visit the official steam page to{" "}
          <a href={steamReviewsUrl!} target="_blank" rel="noopener noreferrer">
            view all reviews{" "}
            <ExternalLink className="-mt-[2px] ml-[1px] inline size-[14px]" />
          </a>
          .
        </p>
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
