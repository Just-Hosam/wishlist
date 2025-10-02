import SectionLayout from "@/components/layout/SectionLayout"
import { FolderCheck } from "lucide-react"

export default function LibraryLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Library" icon={FolderCheck}>
      {children}
    </SectionLayout>
  )
}
