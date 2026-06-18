import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let isConnected = false;

export const connectRedis = async () => {
  if (redisClient) return redisClient;

  // Don't crash if REDIS_URL is missing in local dev, just gracefully degrade
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = createClient({ url: redisUrl });

    let hasLoggedError = false;

    redisClient.on('error', (err) => {
      if (!hasLoggedError) {
        console.warn('Redis Client Error. Caching will be disabled:', err.message);
        hasLoggedError = true;
      }
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
      hasLoggedError = false;
      isConnected = true;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error: any) {
    console.warn('Failed to initialize Redis. Continuing without caching:', error.message);
    isConnected = false;
    return null;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return isConnected ? redisClient : null;
};

// Caching Middleware
export const cacheMiddleware = (durationInSeconds: number) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const client = getRedisClient();
    if (!client) {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    
    try {
      const cachedBody = await client.get(key);
      if (cachedBody) {
        return res.status(200).json(JSON.parse(cachedBody));
      } else {
        // Override res.json to store the response in Redis before sending it
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
          client.setEx(key, durationInSeconds, JSON.stringify(body)).catch(err => {
            console.error('Redis SetEx Error:', err.message);
          });
          return originalJson(body);
        };
        next();
      }
    } catch (err) {
      console.error('Redis Get Error:', err);
      next();
    }
  };
};

export const invalidateCache = async (pattern: string) => {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(`__express__${pattern}`);
    if (keys.length > 0) {
      await Promise.all(keys.map(key => client.del(key)));
      console.log(`[Redis] Invalidated cache for keys matching: ${pattern}`);
    }
  } catch (err) {
    console.error('Redis Invalidation Error:', err);
  }
};
