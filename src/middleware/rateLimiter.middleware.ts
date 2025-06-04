import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from '@/config/redis';

const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      const client = getRedisClient();
      if (!client) {
        console.warn('Redis client not available, rate limiting will use memory store');
        return Promise.resolve(null as any);
      }
      return client.sendCommand(args);
    },
  }),
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const client = getRedisClient();
    return !client;
  }
});

export default rateLimiter;
