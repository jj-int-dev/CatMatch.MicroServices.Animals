import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_PUBLISHABLE_KEY = 'test-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.DATABASE_INTROSPECT_URL =
  'postgresql://test:test@localhost:5432/test';
process.env.AUTHORIZED_CALLER = 'http://localhost:3001';
process.env.CACHE_URL = 'https://test-cache.upstash.io';
process.env.CACHE_TOKEN = 'test-token';
process.env.GEOAPIFY_BASE_API_URL = 'https://api.geoapify.com';
process.env.GEOAPIFY_API_KEY = 'test-api-key';
process.env.GEOAPIFY_IP_GEOLOCATION_API_URL_PATH = '/v1/ipinfo';

// Global test utilities
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn()
};
