import {
    updateCardSelectedService,
} from "../services/player.js";

export const updateCardSelected = async (room, player, card, io) => {
    const roomData = await updateCardSelectedService(room, player, card);
    io.to(room).emit("room:updated", roomData);
};
