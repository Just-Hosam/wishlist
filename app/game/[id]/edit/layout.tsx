import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default async function EditLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader pageName="Edit" showBackButton>
        <Button type="submit">
          <Save />
          Save
        </Button>
      </PageHeader>

      {children}
    </>
  )
}
