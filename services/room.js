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

export const addPlayerToRoomService = async (id, old_data, new_player) => {
    if (old_data.players.includes(new_player)) {
        return old_data;
    }
    const data = {
        ...old_data,
        players: [...old_data.players, new_player]
    }
    return await updateRoom(id, data);
}

export const removePlayerFromRoomService = async (id, old_data, player) => {
    const data = {
        ...old_data,
        players: old_data.players.filter(p => p !== player)
    }
    return await updateRoom(id, data);
}