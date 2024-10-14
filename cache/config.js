import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const url = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
export const redisClient = redis.createClient({
    url: url,
    socket: {
        connectTimeout: 10000
    }
});
