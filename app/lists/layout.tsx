import { DynamicListsHeader } from "@/components/layout/DynamicListsHeader"

export default async function ListsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DynamicListsHeader />

      {children}
    </>
  )
}
