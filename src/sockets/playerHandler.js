import {
    updateCardSelected,
} from "../controllers/player.js";

export default (io, socket) => {
    const cardSelectedHandler = async (room, player, card) => {
        await updateCardSelected(room, player, card, io);
    }

    socket.on('player:card-selected', cardSelectedHandler);
};
