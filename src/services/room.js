import { saveRoom, getRoom, updateRoom } from "../../cache/room.js";
import {
    addPlayerToRoomService,
    removePlayerFromRoomService
} from "./player.js";

export const createRoomService = async (name) => {
    return await saveRoom(name);
};

export const getRoomService = async (id) => {
    return await getRoom(id);
}

export const updateRoomService = async (id, data) => {
    return await updateRoom(id, data);
}

export const joinRoomService = async (name, room, socket, io) => {
    const roomData = await getRoomService(room);
    if (roomData) {
        socket.join(room);

        const newRoomData = await addPlayerToRoomService(room, roomData, name);
        if (newRoomData) {
            io.to(room).emit("room:updated", newRoomData);
        }

        socket.on("disconnect", async () => {
            const updatedRoomData = await getRoomService(room);
            const newRoomData = await removePlayerFromRoomService(room, updatedRoomData, name);
            io.to(room).emit("room:updated", newRoomData);
        });
    }
}

export const resetRoomService = async (room) => {
    const roomData = await getRoomService(room);
    if (roomData) {
        roomData.result = null;
        roomData.players.forEach((p) => (p.card_selected = null));
        await updateRoomService(room, roomData);
    }
    return roomData;
}
