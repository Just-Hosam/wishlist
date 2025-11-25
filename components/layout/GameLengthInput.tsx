"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchGameTimeToBeats } from "@/server/actions/igdb"
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

  useEffect(() => {
    const init = async () => {
      if (value || !igdbGameId) {
        setState("input")
        return
      }

      try {
        const timeData = await fetchGameTimeToBeats(igdbGameId)
        if (timeData?.normallyHours) {
          onChange(timeData.normallyHours.toString())
          setState("fetched")
          return
        }
      } catch (error) {
        console.error("Error fetching game time to beat:", error)
      }

      setState("input")
    }

    init()
  }, [])

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
    <div className="mt-2 flex min-h-10 items-center justify-center">
      <Spinner size={32} className="my-0" />
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
