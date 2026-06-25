interface NavProps {
  children?: React.ReactNode
}

export function Nav({ children }: NavProps) {
  return (
    <>
      {/* CHROME */}
      <div
        className="absolute left-0 right-0 top-0 z-30 m-auto min-h-[96px] max-w-[1200px] bg-gradient-to-b from-background via-background/65 via-55% to-transparent"
        aria-hidden
      />
      {/* NAV BAR */}
      <nav className="absolute left-0 right-0 top-0 z-40 m-auto flex min-h-[96px] max-w-[1200px] items-center gap-4 px-5 pb-7 pt-4">
        {!!children && children}
      </nav>
    </>
  )
}
