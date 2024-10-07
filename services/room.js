import { saveRoom, getRoom, updateRoom } from "../cache/room.js";

export const createRoomService = async (name) => {
    return await saveRoom(name);
};

export const getRoomService = async (id) => {
    return await getRoom(id);
}

export const updateRoomService = async (id, data) => {
    return await updateRoom(id, data);
}
