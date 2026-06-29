"use client"

import { ArrowLeft } from "lucide-react"
import { type MouseEvent, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { Drawer, DrawerOverlay, DrawerPortal } from "../ui/drawer"
import { SearchBar, SearchBarHandle } from "./SearchBar"

interface SearchHeaderProps {
  focusOnMount?: boolean
  initialQuery?: string
  onBack: () => void
  onContentClose?: () => void
}

export function SearchHeader({
  focusOnMount = false,
  initialQuery = "",
  onBack,
  onContentClose
}: SearchHeaderProps) {
  const searchBarRef = useRef<SearchBarHandle>(null)
  const [isContentOpen, setIsContentOpen] = useState(false)

  useEffect(() => {
    const handleFocusSearch = () => {
      searchBarRef.current?.focus()
    }

    window.addEventListener("focus-search-input", handleFocusSearch)

    return () => {
      window.removeEventListener("focus-search-input", handleFocusSearch)
    }
  }, [])

  const closeSearchContent = () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur()
      return
    }

    setIsContentOpen(false)
    onContentClose?.()
  }

  const handleContentOpenChange = (isOpen: boolean) => {
    setIsContentOpen(isOpen)

    if (!isOpen) {
      onContentClose?.()
    }
  }

  const handleBackdropMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    closeSearchContent()
  }

  const handleBackClick = () => {
    if (isContentOpen) {
      closeSearchContent()
      return
    }

    onBack()
  }

  return (
    <Drawer
      open={isContentOpen}
      onOpenChange={handleContentOpenChange}
      shouldScaleBackground={false}
    >
      <DrawerPortal>
        <DrawerOverlay
          className="z-[35] cursor-default backdrop-blur-sm"
          onMouseDown={handleBackdropMouseDown}
          aria-hidden
        />
      </DrawerPortal>
      <div className="relative z-40 flex w-full items-center gap-2">
        <Button
          type="button"
          size="icon"
          onClick={handleBackClick}
          onMouseDown={(event) => event.preventDefault()}
          className="shrink-0 rounded-full shadow-md"
          aria-label="back"
          title="back"
        >
          <ArrowLeft />
        </Button>
        <SearchBar
          ref={searchBarRef}
          focusOnMount={focusOnMount}
          initialQuery={initialQuery}
          onContentOpenChange={handleContentOpenChange}
        />
      </div>
    </Drawer>
  )
}
