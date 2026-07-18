import { config } from 'dotenv';

config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/linear',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  RATE_LIMIT_LOGIN: parseInt(process.env.RATE_LIMIT_LOGIN || '5', 10),
  RATE_LIMIT_REGISTER: parseInt(process.env.RATE_LIMIT_REGISTER || '3', 10),
  RATE_LIMIT_SESSION_LIST: parseInt(process.env.RATE_LIMIT_SESSION_LIST || '30', 10),
  RATE_LIMIT_SESSION_REVOKE: parseInt(process.env.RATE_LIMIT_SESSION_REVOKE || '30', 10),
  RATE_LIMIT_SESSION_REVOKE_ALL: parseInt(process.env.RATE_LIMIT_SESSION_REVOKE_ALL || '10', 10),
  SESSION_LIMIT: parseInt(process.env.SESSION_LIMIT || '10', 10),
  REFRESH_COOKIE_SECURE: process.env.NODE_ENV === 'production' ? true : false,
  CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
  WS_PORT: parseInt(process.env.WS_PORT || '0', 10),
  WS_AUTH_TIMEOUT_MS: parseInt(process.env.WS_AUTH_TIMEOUT_MS || '5000', 10),
  WS_MAX_CONNECTIONS: parseInt(process.env.WS_MAX_CONNECTIONS || '1000', 10),
};
