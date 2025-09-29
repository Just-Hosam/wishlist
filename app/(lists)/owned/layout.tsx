import SectionLayout from "@/components/layout/SectionLayout"
import { FolderCheck } from "lucide-react"

export default function OwnedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Owned" icon={FolderCheck}>
      {children}
    </SectionLayout>
  )
}
