import { PageHeader } from "@/components/layout/PageHeader"

export default async function WishlistLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Wishlist" />

      {children}
    </>
  )
}
