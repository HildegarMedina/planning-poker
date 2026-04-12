import {
    joinRoom,
    resetRoom,
    flipCards,
    setStory,
    newStory,
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

    const setStoryHandler = async (roomId, story) => {
        await setStory(roomId, story, io);
    }

    const newStoryHandler = async (roomId) => {
        await newStory(roomId, io);
    }

    socket.on('room:flip-cards', flipCardsHandler);
    socket.on("room:join", joinRoomHandler);
    socket.on("room:reset", resetRoomHandler);
    socket.on("room:set-story", setStoryHandler);
    socket.on("room:new-story", newStoryHandler);
};
