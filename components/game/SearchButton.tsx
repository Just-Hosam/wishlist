"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { SearchHeader } from "./SearchHeader"

export function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleFocusSearch = () => {
      setIsSearchOpen(true)
    }

    window.addEventListener("focus-search-input", handleFocusSearch)

    return () => {
      window.removeEventListener("focus-search-input", handleFocusSearch)
    }
  }, [])

  if (!isSearchOpen) {
    return (
      <button
        type="button"
        className="relative -mt-1 px-3 py-3"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open search"
      >
        <Search strokeWidth={2.3} />
      </button>
    )
  }

  return (
    <div className="absolute left-5 right-5 top-4">
      <SearchHeader
        focusOnMount
        onBack={() => setIsSearchOpen(false)}
        onContentClose={() => setIsSearchOpen(false)}
      />
    </div>
  )
}
