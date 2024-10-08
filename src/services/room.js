import { saveRoom, getRoom, updateRoom } from "../../cache/room.js";
import {
    addPlayerToRoomService,
    removePlayerFromRoomService
} from "./player.js";

export const createRoomService = async (name) => {
    return await saveRoom(name);
};

export const getRoomService = async (roomId, io=false) => {
    const room = await getRoom(roomId);
    if (!room && io != false) {
        console.log("room:expires BACKEND")
        io.to(roomId).emit("room:expires", { message: "Room has expired" });
    }
    return room;
}

export const updateRoomService = async (roomId, data) => {
    return await updateRoom(roomId, data);
}

export const joinRoomService = async (name, roomId, socket, io) => {
    const roomData = await getRoomService(roomId, io);
    if (roomData) {
        socket.join(roomId);

        const newRoomData = await addPlayerToRoomService(roomId, roomData, name);
        if (newRoomData) {
            io.to(roomId).emit("room:updated", newRoomData);
        }

        socket.on("disconnect", async () => {
            const updatedRoomData = await getRoomService(roomId, io);
            if (updatedRoomData) {
                const newRoomData = await removePlayerFromRoomService(roomId, updatedRoomData, name);
                io.to(roomId).emit("room:updated", newRoomData);
            }
        });
    }
}

export const resetRoomService = async (roomId, io) => {
    const roomData = await getRoomService(roomId, io);
    if (roomData) {
        roomData.result = null;
        roomData.players.forEach((p) => (p.card_selected = null));
        await updateRoomService(roomId, roomData);
    }
    return roomData;
}
