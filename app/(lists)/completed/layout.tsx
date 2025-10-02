import SectionLayout from "@/components/layout/SectionLayout"
import { CheckCircle2 } from "lucide-react"

export default function CompletedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Completed" icon={CheckCircle2}>
      {children}
    </SectionLayout>
  )
}
