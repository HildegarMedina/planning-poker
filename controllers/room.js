import { createRoomService, getRoomService } from '../services/room.js';

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
        res.render('room');
    } else {
        res.redirect('/')
    }
}
