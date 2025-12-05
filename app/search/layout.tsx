import { PageHeader } from "@/components/layout/PageHeader"

export default async function SearchLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Search" showBackButton />

      {children}
    </>
  )
}
