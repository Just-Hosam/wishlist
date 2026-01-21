interface NavProps {
  children?: React.ReactNode
}

export function Nav({ children }: NavProps) {
  return (
    <nav className="absolute left-0 right-0 top-0 z-30 m-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-3 bg-[#fafafa] px-6 pb-4 pt-5">
      {!!children && children}
    </nav>
  )
}
