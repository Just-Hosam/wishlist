import { cn } from "@/lib/utils"

const currencyMap = {
  USD: "$",
  CAD: "$",
  EUR: "€",
  GBP: "£"
}

interface PriceLayoutProps {
  onSale: boolean
  currentPrice: number
  regularPrice: number
  currency: string
  inverted?: boolean
  className?: string
}

export default function PriceLayout({
  onSale,
  currentPrice,
  regularPrice,
  currency,
  inverted = false,
  className
}: PriceLayoutProps) {
  const currencySymbol =
    currencyMap[currency as keyof typeof currencyMap] || "$"

  const formatPrice = (price: number) => {
    return `${currencySymbol}${price.toFixed(2)}`
  }

  const currentPriceTextClass = inverted
    ? "text-primary-foreground"
    : "text-foreground"
  const regularPriceTextClass = inverted
    ? "text-primary-foreground/70"
    : "text-muted-foreground"

  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn("text-lg font-medium", currentPriceTextClass)}>
        {formatPrice(currentPrice)}
      </span>
      {onSale && regularPrice && currentPrice !== regularPrice && (
        <>
          <span
            className={cn(
              "ml-[6px] text-sm font-light line-through",
              regularPriceTextClass
            )}
          >
            {formatPrice(regularPrice)}
          </span>
          <span className="ml-2 rounded bg-red-600 px-1 py-[2px] text-sm text-primary-foreground">
            -{Math.round(((regularPrice - currentPrice) / regularPrice) * 100)}%
          </span>
        </>
      )}
    </div>
  )
}
