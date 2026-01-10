import { Redis } from '@upstash/redis';
import config from '../config/config';

export const cache = new Redis({
  url: config.CACHE_URL,
  token: config.CACHE_TOKEN
});
