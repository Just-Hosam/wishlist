export const ACCENT_STORAGE_KEY = "accent"

export const Accent = {
  PURPLE: "PURPLE",
  ORANGE: "ORANGE",
  PINK: "PINK",
  BLUE: "BLUE"
} as const

export type Accent = (typeof Accent)[keyof typeof Accent]
