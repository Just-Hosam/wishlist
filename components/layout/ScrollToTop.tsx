"use client"

export function ScrollToTop() {
  const scrollToTop = () => {
    const scrollEl =
      document.querySelector<HTMLElement>("[data-scroll-container]") ??
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement

    scrollEl.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <div
      // Only show 20px in the app
      className="absolute inset-x-0 -top-5 z-40 h-10 bg-transparent"
      onClick={scrollToTop}
    ></div>
  )
}
