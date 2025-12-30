import { PageHeader } from "@/components/layout/PageHeader"

export default async function EditLayout({
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
