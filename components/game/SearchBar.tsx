"use client"

import { encodePathSegment } from "@/lib/path"
import { deleteSearchQuery, saveSearchQuery } from "@/server/actions/search"
import {
  MAX_SEARCH_KEYWORD_SUGGESTIONS,
  MIN_SEARCH_KEYWORD_QUERY_LENGTH,
  SearchKeywordSuggestion
} from "@/types/search"
import { ArrowUpLeft, History, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "../navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover"
import { Skeleton } from "../ui/skeleton"

interface Props {
  initialQuery?: string
}

type VisibleItem =
  | { kind: "history"; key: string; label: string }
  | { kind: "suggestion"; key: string; label: string; igdbId: number }

export function SearchBar({ initialQuery = "" }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [history, setHistory] = useState<string[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [suggestions, setSuggestions] = useState<SearchKeywordSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const trimmedQuery = query.trim()
  const canShowKeywordSuggestions =
    trimmedQuery.length >= MIN_SEARCH_KEYWORD_QUERY_LENGTH
  const recentHistory = history.slice(0, MAX_SEARCH_KEYWORD_SUGGESTIONS)
  const suggestionItems: VisibleItem[] = suggestions.map((suggestion) => ({
    kind: "suggestion",
    key: `suggestion-${suggestion.igdbId}`,
    label: suggestion.name,
    igdbId: suggestion.igdbId
  }))
  const historyItems: VisibleItem[] = recentHistory.map((keyword) => ({
    kind: "history",
    key: `history-${keyword}`,
    label: keyword
  }))
  const visibleItems: VisibleItem[] =
    canShowKeywordSuggestions && suggestionItems.length > 0
      ? suggestionItems
      : historyItems
  const isLoading = canShowKeywordSuggestions
    ? isLoadingSuggestions
    : isLoadingHistory
  const hasVisibleContent = isLoading || visibleItems.length > 0
  const open = isInputFocused && hasVisibleContent

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
    setActiveIndex(-1)
  }, [trimmedQuery, visibleItems.length])

  useEffect(() => {
    const handleFocusSearch = () => {
      inputRef.current?.focus()
    }

    window.addEventListener("focus-search-input", handleFocusSearch)

    return () => {
      window.removeEventListener("focus-search-input", handleFocusSearch)
    }
  }, [])

  useEffect(() => {
    if (!canShowKeywordSuggestions) {
      setSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setIsLoadingSuggestions(true)

      fetch(`/api/search-keywords?q=${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal
      })
        .then((res) => res.json())
        .then((results: SearchKeywordSuggestion[]) => {
          setSuggestions(results)
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return
          }
          setSuggestions([])
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoadingSuggestions(false)
          }
        })
    }, 150)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [canShowKeywordSuggestions, trimmedQuery])

  const navigateToSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) return

    setIsInputFocused(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
    router.push(`/search/${encodePathSegment(trimmedKeyword)}`)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!trimmedQuery) return

    navigateToSearch(trimmedQuery)

    setHistory((prev) => [
      trimmedQuery,
      ...prev.filter((q) => q !== trimmedQuery)
    ])
  }

  const handleClearSearch = () => {
    setQuery("")
    setSuggestions([])
    setActiveIndex(-1)
    setIsInputFocused(true)
    inputRef.current?.focus()
    router.push("/search")
  }

  const handleQueryClick = (keyword: string) => {
    setQuery(keyword)
    navigateToSearch(keyword)
    setHistory((prev) => [keyword, ...prev.filter((q) => q !== keyword)])
    void saveSearchQuery(keyword).catch((error) => {
      console.error("Error saving search query:", error)
    })
  }

  const handleSearchQueryDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    keyword: string
  ) => {
    event.stopPropagation()
    setHistory((prev) => prev.filter((q) => q !== keyword))
    void deleteSearchQuery(keyword)
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsInputFocused(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
      return
    }

    if (visibleItems.length === 0) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % visibleItems.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? visibleItems.length - 1 : prev - 1))
      return
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault()
      handleQueryClick(visibleItems[activeIndex].label)
    }
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
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
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
        className="z-40 mt-2 max-w-[500px] px-0 py-[2px]"
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxWidth: "500px"
        }}
        onMouseDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading
          ? Array.from({ length: MAX_SEARCH_KEYWORD_SUGGESTIONS }).map(
              (_, index) => (
                <SearchPopoverRow
                  action={<Skeleton className="size-4 rounded-full" />}
                  icon={<Skeleton className="size-[15px] rounded-full" />}
                  isActive={false}
                  key={`skeleton-${index}`}
                  label={<Skeleton className="h-4 w-36" />}
                  onClick={undefined}
                />
              )
            )
          : null}

        {!isLoading
          ? visibleItems.map((item, index) => (
              <SearchPopoverRow
                icon={
                  item.kind === "history" ? (
                    <History className="size-[15px] text-muted-foreground" />
                  ) : (
                    <Search className="size-[15px] text-muted-foreground" />
                  )
                }
                action={
                  item.kind === "history" ? (
                    <Button
                      variant="ghost"
                      className="size-full rounded-full p-0"
                      aria-label={`Remove ${item.label} from recent searches`}
                      title={`Remove ${item.label} from recent searches`}
                      onClick={(event) =>
                        handleSearchQueryDelete(event, item.label)
                      }
                    >
                      <X className="size-4 text-muted-foreground" />
                    </Button>
                  ) : (
                    <ArrowUpLeft className="size-4 text-muted-foreground" />
                  )
                }
                isActive={activeIndex === index}
                key={item.key}
                label={item.label}
                onClick={() => handleQueryClick(item.label)}
              />
            ))
          : null}
      </PopoverContent>
    </Popover>
  )
}

function SearchPopoverRow({
  action,
  icon,
  isActive,
  label,
  onClick
}: {
  action: React.ReactNode
  icon: React.ReactNode
  isActive: boolean
  label: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div
      className={`flex min-h-11 cursor-pointer items-center gap-2 border-b py-2 pl-5 pr-2 text-sm last:border-none ${
        isActive ? "bg-muted/60" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex size-8 shrink-0 items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        {typeof label === "string" ? (
          <span className="line-clamp-1 block">{label}</span>
        ) : (
          label
        )}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center">
        {action}
      </div>
    </div>
  )
}
