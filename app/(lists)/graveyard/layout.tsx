import SectionLayout from "@/components/layout/SectionLayout"
import { Archive } from "lucide-react"

export default function ArchivedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Archived" icon={Archive}>
      {children}
    </SectionLayout>
  )
}
