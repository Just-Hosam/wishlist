"use client"

import { tryCatch } from "@/lib/utils"
import { getCachedHLTBTimeToBeat } from "@/server/actions/hltb"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "sonner"

interface UseAutoPopulateHLTBTimeToBeatOptions {
  isOpen: boolean
  name: string
  setValue: Dispatch<SetStateAction<number | null>>
}

export default function useAutoPopulateHLTBTimeToBeat({
  isOpen,
  name,
  setValue
}: UseAutoPopulateHLTBTimeToBeatOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasResolved, setHasResolved] = useState(false)

  useEffect(() => {
    if (!isOpen || hasResolved || !name.trim()) return

    let cancelled = false

    const loadTimeToBeat = async () => {
      setIsLoading(true)

      const { data, error } = await tryCatch(getCachedHLTBTimeToBeat(name))

      if (cancelled) return

      if (error) {
        console.error("Error fetching HLTB time to beat:", error)
        toast.error("Failed to fetch time to beat.")
      } else if (data !== null) {
        setValue((prev) => {
          const timeToBeat = data.extra || data.story || data.complete
          return timeToBeat ?? prev
        })
      }

      setHasResolved(true)
      setIsLoading(false)
    }

    loadTimeToBeat()

    return () => {
      cancelled = true
      setIsLoading(false)
    }
  }, [hasResolved, isOpen, name, setValue])

  useEffect(() => {
    setHasResolved(false)
    setIsLoading(false)
  }, [name])

  return {
    isLoading
  }
}
