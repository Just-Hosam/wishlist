import { PriceInput } from "@/types"
import {
  buildRedisKey,
  redisDelMany,
  redisGet,
  redisKeys,
  redisSet
} from "@/server/cache/redis"

const PRICE_CACHE_NAMESPACE = "price:v1"
const DEFAULT_PRICE_TTL_SECONDS = 86_400 // 1 day

function getPriceCacheKey(storeUrl: string): string {
  return buildRedisKey(PRICE_CACHE_NAMESPACE, encodeURIComponent(storeUrl))
}

export async function getCachedPriceByUrl(
  storeUrl: string
): Promise<PriceInput | null> {
  return redisGet<PriceInput>(getPriceCacheKey(storeUrl))
}

export async function setCachedPriceByUrl(
  price: PriceInput,
  ttlSeconds = DEFAULT_PRICE_TTL_SECONDS
): Promise<void> {
  await redisSet(getPriceCacheKey(price.storeUrl), price, ttlSeconds)
}

export async function invalidateAllCachedPrices(): Promise<number> {
  const keys = await redisKeys(buildRedisKey(PRICE_CACHE_NAMESPACE, "*"))
  if (keys.length === 0) return 0

  return redisDelMany(keys)
}
