import {
    createRoomService,
    getRoomService,
    joinRoomService,
    resetRoomService,
} from "../services/room.js";
import { flipCardsService } from "../services/player.js";

export const createRoom = async (req, res, next) => {
    const { name } = req.body;
    const uniqueId = await createRoomService(name);
    if (uniqueId) {
        res.status(201).json({ id: uniqueId });
    } else {
        res.status(500).json({ message: "Failed to create room" });
    }
};

export const getRoom = async (req, res, next) => {
    const { id } = req.params;
    const room = await getRoomService(id);
    if (room) {
        const roomCode = req.protocol + "://" + req.get("host") + req.originalUrl;
        res.render("room", { title: "Room", roomCode: roomCode });
    } else {
        res.redirect("/");
    }
};

export const joinRoom = async (name, room, socket, io) => {
    await joinRoomService(name, room, socket, io);
};

export const resetRoom = async (room, io) => {
    const roomData = await resetRoomService(room, io);
    io.to(room).emit("room:updated", roomData);
};

export const flipCards = async (room, io) => {
    const roomData = await getRoomService(room);
    if (roomData) {
        const roomDataUpdated = await flipCardsService(roomData);
        io.to(room).emit("room:cards-flipped", roomDataUpdated);
    }
};
