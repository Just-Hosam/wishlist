import "server-only"

import { Redis } from "@upstash/redis"
import { tryCatch } from "@/lib/utils"

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    })
  : null

export function buildRedisKey(namespace: string, key: string): string {
  return `${namespace}:${key}`
}

export async function redisGet<T>(key: string): Promise<T | null> {
  if (!redis) return null

  const { data, error } = await tryCatch(redis.get<T>(key))

  if (error) {
    console.error(`Failed to read Redis key "${key}":`, error)
    return null
  }

  return data
}

export async function redisSet<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  if (!redis) return

  const promise = ttlSeconds
    ? redis.set(key, value, { ex: ttlSeconds })
    : redis.set(key, value)

  const { error } = await tryCatch(promise)

  if (error) {
    console.error(`Failed to write Redis key "${key}":`, error)
  }
}

export async function redisDel(key: string): Promise<void> {
  if (!redis) return

  const { error } = await tryCatch(redis.del(key))

  if (error) {
    console.error(`Failed to delete Redis key "${key}":`, error)
  }
}

export async function redisKeys(pattern: string): Promise<string[]> {
  if (!redis) {
    throw new Error("Redis is not configured")
  }

  const { data, error } = await tryCatch(redis.keys(pattern))

  if (error) {
    throw new Error(
      `Failed to list Redis keys for pattern "${pattern}": ${String(error)}`
    )
  }

  return data ?? []
}

export async function redisDelMany(keys: string[]): Promise<number> {
  if (!redis) {
    throw new Error("Redis is not configured")
  }
  if (keys.length === 0) return 0

  const { data, error } = await tryCatch(redis.del(...keys))

  if (error) {
    throw new Error(`Failed to delete Redis keys: ${String(error)}`)
  }

  return data ?? 0
}
