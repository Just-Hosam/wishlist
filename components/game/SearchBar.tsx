"use client"

import { encodePathSegment } from "@/lib/path"
import { deleteSearchQuery } from "@/server/actions/search"
import { History, Loader2, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "../navigation"
import { Input } from "../ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"

interface Props {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [history, setHistory] = useState<string[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isMounted = true

    fetch("/api/search-history")
      .then((res) => res.json())
      .then((queries: string[]) => {
        if (!isMounted) return
        setHistory(queries)
      })
      .catch(() => {})
      .finally(() => {
        if (!isMounted) return
        setIsLoadingHistory(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

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
    if (!trimmedQuery) return

    router.push(`/search/${encodePathSegment(trimmedQuery)}`)

    setHistory((prev) => [
      trimmedQuery,
      ...prev.filter((q) => q !== trimmedQuery)
    ])
  }

  const handleClearSearch = () => {
    router.push("/search")
    setQuery("")
    inputRef.current?.focus()
  }

  const handleQueryClick = (keyword: string) => {
    inputRef.current?.blur()
    router.push(`/search/${encodePathSegment(keyword.trim())}`)

    setHistory((prev) => [keyword, ...prev.filter((q) => q !== keyword)])
  }

  const handleSearchQueryDelete = (keyword: string) => {
    setHistory((prev) => prev.filter((q) => q !== keyword))
    deleteSearchQuery(keyword)

    setHistory((prev) => [keyword, ...prev.filter((q) => q !== keyword)])
  }

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
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
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
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
      </PopoverAnchor>
      <PopoverContent
        className="z-40 mt-2 px-0 py-[2px]"
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxWidth: "500px"
        }}
        onMouseDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoadingHistory ? (
          <div className="flex items-center gap-2 py-3 pl-5 pr-4 text-sm text-muted-foreground">
            <Loader2 className="size-[15px] animate-spin" />
            <span>Loading recent searches...</span>
          </div>
        ) : (
          history.map((keyword, index) => {
            if (index >= 4) return null

            return (
              <div
                className="flex cursor-pointer items-center gap-2 border-b py-2 pl-5 pr-2 text-sm last:border-none"
                onClick={() => handleQueryClick(keyword)}
                key={keyword}
              >
                <History className="size-[15px] text-muted-foreground" />
                <span className="line-clamp-1 flex-1">{keyword}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSearchQueryDelete(keyword)
                  }}
                >
                  <X className="size-4 text-muted-foreground" />
                </Button>
              </div>
            )
          })
        )}
      </PopoverContent>
    </Popover>
  )
}
