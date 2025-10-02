import SectionLayout from "@/components/layout/SectionLayout"
import { Heart } from "lucide-react"

export default function WishlistLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Wishlist" icon={Heart}>
      {children}
    </SectionLayout>
  )
}
