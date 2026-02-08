import { Redis } from '@upstash/redis';
import config from '../config/config';
import * as z from 'zod';

const cache = new Redis({
  url: config.CACHE_URL,
  token: config.CACHE_TOKEN,
  responseEncoding: false,
  retry: { retries: 0 }
});

async function getFromCache<T>(
  key: string,
  validator: z.ZodSchema<T>
): Promise<T | null> {
  const value = await cache.get(key);
  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      const { success, data } = validator.safeParse(parsedValue);
      if (success) return data;
      await cache.del(key);
    } catch (error) {
      await cache.del(key);
    }
  }
  return null;
}

async function addToCache<T>(
  key: string,
  data: T,
  cacheDurationSeconds: number = 86400
): Promise<void> {
  await cache.set(key, JSON.stringify(data), { ex: cacheDurationSeconds });
}

export { cache, getFromCache, addToCache };
