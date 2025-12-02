import { PageHeader } from "@/components/layout/PageHeader"

export default async function ListsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader>
        <h2 className="text-lg">Completed Games</h2>
      </PageHeader>
      {children}
    </>
  )
}
