import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = redis.createClient();