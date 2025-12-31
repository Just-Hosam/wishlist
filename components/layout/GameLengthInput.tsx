"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchTimeToBeat } from "@/server/actions/igdb"
import { useEffect, useState } from "react"
import Spinner from "../ui/spinner"

interface GameLengthInputProps {
  igdbGameId?: string
  value: string
  onChange: (value: string) => void
}

type State = "loading" | "input" | "fetched"

export default function GameLengthInput({
  igdbGameId,
  value,
  onChange
}: GameLengthInputProps) {
  const [state, setState] = useState<State>("loading")
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      if (hasFetched) {
        setState("fetched")
        return
      }

      if (value || !igdbGameId) {
        setState("input")
        return
      }

      try {
        const time = await fetchTimeToBeat(igdbGameId)
        if (!cancelled && time) {
          onChange(time.toString())
          setHasFetched(true)
          setState("fetched")
          return
        }
      } catch (error) {
        console.error("Error fetching game time to beat:", error)
      }

      if (!cancelled) {
        setState("input")
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [igdbGameId, value, onChange, hasFetched])

  return (
    <>
      <label className="text-sm font-semibold" htmlFor="length">
        Game Length
      </label>
      {state === "loading" && loadingState()}
      {state === "fetched" && fetchedState(value)}
      {state === "input" && inputState(value, onChange)}
    </>
  )
}

const loadingState = () => {
  return (
    <div className="mt-2 flex items-center justify-start">
      <Spinner size={20} className="m-0" />
    </div>
  )
}

const fetchedState = (value: string) => {
  return (
    <p className="mt-2 text-sm text-gray-700">
      The game takes around
      <span className="font-semibold"> {value} hours</span>.
    </p>
  )
}

const inputState = (value: string, onChange: (value: string) => void) => {
  const handleIncrement = (amount: number) => {
    const currentValue = parseInt(value) || 0
    const newValue = Math.max(0, Math.min(9999, currentValue + amount))
    onChange(newValue.toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === "") {
      onChange("")
    } else {
      const numValue = parseInt(inputValue)
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 9999) {
        onChange(numValue.toString())
      }
    }
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">
        Enter the length in hours.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(-10)}
          className="min-h-10 flex-1"
        >
          -10
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(-1)}
          className="min-h-10 flex-1"
        >
          -1
        </Button>
        <Input
          type="number"
          placeholder="0"
          min="0"
          max="9999"
          value={value}
          onChange={handleInputChange}
          className="flex-[2] text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(1)}
          className="min-h-10 flex-1"
        >
          +1
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(10)}
          className="min-h-10 flex-1"
        >
          +10
        </Button>
      </div>
    </>
  )
}
