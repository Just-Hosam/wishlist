import { LucideIcon } from "lucide-react"

interface SectionLayoutProps {
  children: React.ReactNode
  title: string
  icon: LucideIcon
  className?: string
}

export default function SectionLayout({
  children,
  title,
  icon: Icon,
  className,
}: SectionLayoutProps) {
  return (
    <div className={className}>
      <h2 className="sticky top-[88px] flex min-h-14 items-center gap-3 bg-white pb-4 text-2xl">
        <Icon />
        {title}
      </h2>
      {children}
    </div>
  )
}
