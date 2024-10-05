import { redisClient } from './config.js';

export const getRoom = async (id) => {
    const room = await redisClient.get(`room:${id}`);
    if (room) {
        return JSON.parse(room);
    }
    return null;
}

export const saveRoom = async (name) => {
    const randomId = Math.random().toString(36).slice(2);
    const data = {
        name: name,
        id: randomId,
        players: [],
    }
    await redisClient.set(`room:${randomId}`, JSON.stringify(data));
    return randomId;
}

export const removeRoom = async (roomId) => {
    await redisClient.del(`room:${roomId}`);
}

export const updateRoom = async (roomId, data) => {
    await redisClient.set(`room:${roomId}`, JSON.stringify(data));
    return data;
}
