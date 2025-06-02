import { RateLimiterMemory } from 'rate-limiter-flexible';

const RATE_LIMIT_POINTS = Number(process.env.RATE_LIMIT_POINTS) || 10;
const RATE_LIMIT_DURATION = Number(process.env.RATE_LIMIT_DURATION) || 60;
const RATE_LIMIT_BLOCK_DURATION = Number(process.env.RATE_LIMIT_BLOCK_DURATION) || 60 * 2;

export const rateLimiter = new RateLimiterMemory({
  points: RATE_LIMIT_POINTS, 
  duration: RATE_LIMIT_DURATION,
  blockDuration: RATE_LIMIT_BLOCK_DURATION,
});

export async function rateLimiterMiddleware(ip: string): Promise<void> {
  try {
    await rateLimiter.consume(ip);
  } catch (error) {
    throw new Error('Too many requests. Please try again later.');
  }
} 