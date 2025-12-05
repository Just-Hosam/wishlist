import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default async function AddLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Add" showBackButton />

      {children}
    </>
  )
}
