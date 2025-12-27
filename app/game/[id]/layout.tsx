import { PageHeader } from "@/components/layout/PageHeader"

export default async function GameLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader showBackButton />

      {children}
    </>
  )
}
