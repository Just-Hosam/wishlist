import { PageHeader } from "@/components/layout/PageHeader"

export default async function LibraryLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Library" />

      {children}
    </>
  )
}
