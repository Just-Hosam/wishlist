import { PageHeader } from "@/components/layout/PageHeader"

export default async function ListsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Lists" />

      {children}
    </>
  )
}
