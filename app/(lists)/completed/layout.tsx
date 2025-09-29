import SectionLayout from "@/components/layout/SectionLayout"
import { CircleCheckBig } from "lucide-react"

export default function CompletedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Completed" icon={CircleCheckBig}>
      {children}
    </SectionLayout>
  )
}
