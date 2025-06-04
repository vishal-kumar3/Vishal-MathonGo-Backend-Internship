import { getRedisClient } from "@/config/redis";
import { ChapterFilters } from "@/types/index.types";

const CACHE_TTL = 3600; // 1 hour

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const redisClient = getRedisClient();
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const setCachedData = async (key: string, data: any, ttl: number = CACHE_TTL): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const deleteCachedData = async (pattern: string): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const generateCacheKey = (baseKey: string, filters: ChapterFilters, page: number, limit: number): string => {
  const filterString = Object.keys(filters)
    .sort()
    .map(key => `${key}:${(filters as any)[key]}`)
    .join(',');
  return `${baseKey}:${filterString}:page:${page}:limit:${limit}`;
};
