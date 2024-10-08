import {
    joinRoom,
    resetRoom,
    flipCards,
} from "../controllers/room.js";

export default (io, socket) => {
    const joinRoomHandler = async (name, roomId) => {
        await joinRoom(name, roomId, socket, io);
    };

    const resetRoomHandler = async (roomId) => {
        await resetRoom(roomId, io);
    };

    const flipCardsHandler = async (roomId) => {
        await flipCards(roomId, io);
    }

    socket.on('room:flip-cards', flipCardsHandler);
    socket.on("room:join", joinRoomHandler);
    socket.on("room:reset", resetRoomHandler);
};
