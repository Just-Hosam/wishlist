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
      <header className="sticky top-[88px] flex items-center justify-between gap-4 bg-white pb-4">
        <h2 className="flex items-center gap-3 text-2xl">
          <Icon />
          {title}
        </h2>
      </header>
      {children}
    </div>
  )
}
