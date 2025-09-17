import SectionLayout from "@/components/layout/SectionLayout"
import { ScrollText } from "lucide-react"

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Wishlist" icon={ScrollText}>
      {children}
    </SectionLayout>
  )
}
