import { createRoomService, getRoomService, updateRoomService } from '../services/room.js';
import { addPlayerToRoomService, removePlayerFromRoomService, updateCardSelectedService, calculateResultService } from '../services/player.js';

export const createRoom = async (req, res, next) => {
    const { name } = req.body;
    const uniqueId = await createRoomService(name);
    if (uniqueId) {
        res.status(201).json({ id: uniqueId });
    } else {
        res.status(500).json({ message: 'Failed to create room' });
    }
};

export const getRoom = async (req, res, next) => {
    const { id } = req.params;
    const room = await getRoomService(id);
    if (room) {
        const roomCode = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.render('room', { title: 'Room', roomCode: roomCode});
    } else {
        res.redirect('/')
    }
}

export const joinRoom = async (name, room, socket, io) => {
    const roomData = await getRoomService(room)
    if (roomData) {

        socket.join(room); // Join player to room and 
        console.log(name + ` joined room: ${room}`);

        // Add player to room
        const newRoomData = await addPlayerToRoomService(room, roomData, name);
        if (newRoomData) {
            console.log(name + ' added to room');
            io.to(room).emit('room updated', newRoomData);
        }

        socket.on('disconnect', async () => {
            const updatedRoomData = await getRoomService(room); 
            const newRoomData = await removePlayerFromRoomService(room, updatedRoomData, name);
            io.to(room).emit('room updated', newRoomData);
            console.log(name + ' disconnected of room');
        });
    }

}

export const updateCardSelected = async (room, player, card, io) => {
    const roomData = await updateCardSelectedService(room, player, card);
    io.to(room).emit('room updated', roomData)
    console.log(player + ' Card selected: ' + card);
}

export const resetRoom = async (room, io) => {
    const roomData = await getRoomService(room);
    if (roomData) {
        roomData.players.forEach(p => p.card_selected = null);
        await updateRoomService(room, roomData);
        io.to(room).emit('room updated', roomData);
        console.log('Room reset');
    }
}

export const flipCardsAndCalculateResult = async (room, io) => {
    const roomData = await getRoomService(room);
    if (roomData) {
        const roomDataUpdated = calculateResultService(roomData);
        io.to(room).emit('cards flipped', roomDataUpdated);
        console.log('Cards flipped and results calculated');
    }
}