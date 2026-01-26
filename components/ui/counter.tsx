"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"

interface GameLengthInputProps {
  value: number | null
  onChange: (value: number | null) => void
}

export default function Counter({ value, onChange }: GameLengthInputProps) {
  const handleIncrement = (amount: number) => {
    const currentValue = value ?? 0
    const newValue = Math.max(0, Math.min(9999, currentValue + amount))
    onChange(newValue)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    if (inputValue === "") {
      onChange(null)
      return
    }

    const numericValue = parseInt(inputValue, 10)
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 9999) {
      onChange(numericValue)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleIncrement(-10)}
        className="min-h-10 flex-1"
      >
        -10
      </Button>
      <Button
        type="button"
        variant="secondary"
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
        value={value ?? ""}
        onChange={handleInputChange}
        className="flex-[2] text-center"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleIncrement(1)}
        className="min-h-10 flex-1"
      >
        +1
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleIncrement(10)}
        className="min-h-10 flex-1"
      >
        +10
      </Button>
    </div>
  )
}
