import SectionLayout from "@/components/layout/SectionLayout"
import { Skull } from "lucide-react"

export default function GraveyardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionLayout title="Graveyard" icon={Skull}>
      {children}
    </SectionLayout>
  )
}
