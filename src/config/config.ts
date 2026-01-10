import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  DATABASE_URL: string;
  DATABASE_INTROSPECT_URL: string;
  AUTHORIZED_CALLER: string;
  CACHE_URL: string;
  CACHE_TOKEN: string;
  GEOAPIFY_BASE_API_URL: string;
  GEOAPIFY_API_KEY: string;
  GEOAPIFY_IP_GEOLOCATION_API_URL_PATH: string;
}

const config: Config = {
  PORT: +process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  DATABASE_INTROSPECT_URL: process.env.DATABASE_INTROSPECT_URL!,
  AUTHORIZED_CALLER: process.env.AUTHORIZED_CALLER!,
  CACHE_URL: process.env.CACHE_URL!,
  CACHE_TOKEN: process.env.CACHE_TOKEN!,
  GEOAPIFY_BASE_API_URL: process.env.GEOAPIFY_BASE_API_URL!,
  GEOAPIFY_API_KEY: process.env.GEOAPIFY_BASE_API_URL!,
  GEOAPIFY_IP_GEOLOCATION_API_URL_PATH: process.env.GEOAPIFY_BASE_API_URL!
};

export default config;
