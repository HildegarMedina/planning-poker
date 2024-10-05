import { saveRoom, getRoom } from "../cache/room.js";

export const createRoomService = async (name) => {
    return await saveRoom(name);
};

export const getRoomService = async (id) => {
    return await getRoom(id);
}