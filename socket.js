import { Server } from 'socket.io';
import { joinRoom, updateCardSelected } from './controllers/room.js';

const setupSocket = (server) => {
    const io = new Server(server);

    io.on('connection', async (socket) => {
        console.log('User connected');

        socket.on('join room', (name, room) => joinRoom(name, room, socket, io));

        socket.on('card selected', (room, player, card) => {
            updateCardSelected(room, player, card, io);
        });

        socket.on('disconnect', async () => {
            console.log('user disconnected');
        });
    });

    return io;
};

export default setupSocket;