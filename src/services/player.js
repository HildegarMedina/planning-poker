import { updateRoom } from "../../cache/room.js";
import { getRoomService } from './room.js';

export const addPlayerToRoomService = async (id, old_data, new_player) => {
    const playerExists = old_data.players.find(p => p.name === new_player);
    if (playerExists) {
        return old_data;
    }
    const avatarIndex = Math.floor(Math.random() * 14) + 1;
    const playerData = {
        admin: old_data.players.length == 0,
        name: new_player,
        avatar_index: avatarIndex,
        card_selected: null
    }
    const data = {
        ...old_data,
        players: [...old_data.players, playerData]
    }
    return await updateRoom(id, data);
}

export const removePlayerFromRoomService = async (id, old_data, player_name) => {
    const data = {
        ...old_data,
        players: old_data.players.filter(p => p.name !== player_name)
    }
    return await updateRoom(id, data);
}

export const updateCardSelectedService = async (room, player_name, card, io) => {
    const roomData = await getRoomService(room, io);
    if (roomData) {
        const playerIndex = roomData.players.findIndex(p => p.name === player_name);
        if (playerIndex !== -1) {
            roomData.players[playerIndex].card_selected = card;
            await updateRoom(room, roomData);
        }
        return roomData;
    }
}

export const flipCardsService = async (roomData) => {
    const cardCounts = {};
    let total = 0;
    let count = 0;

    roomData.players.forEach(player => {
        const card = player.card_selected;
        if (card != null && card != '?' && card != '☕') {
            cardCounts[card] = (cardCounts[card] || 0) + 1;
            let number = (card == "?" || card == "☕") ? 0 : card;
            number = (number == "1/2") ? 0.5 : number;
            total += parseFloat(number);
            count++;
        }
    });

    const average = count > 0 ? total / count : 0;
    roomData["result"] = {
        "cardCounts": cardCounts,
        "average": average.toFixed(2)
    }
    await updateRoom(roomData.id, roomData);
    return roomData;
}
