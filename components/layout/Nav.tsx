import { cn } from "@/lib/utils"

interface NavProps {
  children?: React.ReactNode
}

export function Nav({ children }: NavProps) {
  return (
    <nav
      className={cn(
        "absolute left-0 right-0 top-0 z-30 m-auto flex min-h-[84px] max-w-[1200px] items-center gap-3 bg-gradient-to-b from-white via-white/65 via-55% to-transparent px-5 pb-6 pt-3"
      )}
    >
      {!!children && children}
    </nav>
  )
}
