"use client"

import { encodePathSegment } from "@/lib/path"
import { Search, X } from "lucide-react"
import { Input } from "../ui/input"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "../navigation"

interface Props {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const handleFocusSearch = () => {
      inputRef.current?.focus()
    }

    window.addEventListener("focus-search-input", handleFocusSearch)

    return () => {
      window.removeEventListener("focus-search-input", handleFocusSearch)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    inputRef.current?.blur()
    const trimmedQuery = query.trim()

    router.push(`/search/${encodePathSegment(trimmedQuery)}`)
  }

  const handleClearSearch = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden
        size={18}
      />

      <Input
        ref={inputRef}
        type="text"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for games..."
        className="pl-11 pr-12 transition-all duration-200"
      />

      {query && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-muted-foreground hover:text-muted-foreground/80"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </form>
  )
}
