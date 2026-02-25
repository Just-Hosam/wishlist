import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * Try Catch helper written by Theo from t3.gg
 * Usage:
 * const { data, error } = await tryCatch(fetchData())
 * if (error) {
 *   // handle error
 * } else {
 *   // use data
 * }
 * @param promise The promise to execute
 * @returns An object containing either the data or the error
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatReleaseDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
