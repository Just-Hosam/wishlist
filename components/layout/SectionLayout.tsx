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
  className 
}: SectionLayoutProps) {
  return (
    <div className={className}>
      <header className="flex justify-between items-center gap-4 pb-6 sticky top-[88px] bg-white">
        <h2 className="flex items-center gap-3 text-2xl">
          <Icon />
          {title}
        </h2>
      </header>
      {children}
    </div>
  )
}
