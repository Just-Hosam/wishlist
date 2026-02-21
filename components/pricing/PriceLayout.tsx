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
  className?: string
}

export default function PriceLayout({
  onSale,
  currentPrice,
  regularPrice,
  currency,
  className
}: PriceLayoutProps) {
  const currencySymbol =
    currencyMap[currency as keyof typeof currencyMap] || "$"

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"

    return `${currencySymbol}${price.toFixed(2)}`
  }

  return (
    <div className={"flex items-center " + className}>
      <span className="text-sm font-medium">{formatPrice(currentPrice)}</span>
      {onSale && regularPrice && currentPrice !== regularPrice && (
        <>
          <span className="ml-[6px] text-xs font-light text-muted-foreground line-through">
            {formatPrice(regularPrice)}
          </span>
          <span className="ml-2 rounded bg-red-600 px-1 py-[2px] text-xs text-white">
            -{Math.round(((regularPrice - currentPrice) / regularPrice) * 100)}%
          </span>
        </>
      )}
    </div>
  )
}
