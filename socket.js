import { Server } from 'socket.io';
import { getRoomService, removePlayerFromRoomService, addPlayerToRoomService } from './services/room.js';

const setupSocket = (server) => {
    const io = new Server(server);

    io.on('connection', async (socket) => {
        console.log('a user connected');

        socket.on('join room', async (name, room) => {

            const roomData = await getRoomService(room)
            if (roomData) {
                // Join player to room and 
                socket.join(room);
                console.log(name + ` joined room: ${room}`);

                // Add player to room
                const newRoomData = await addPlayerToRoomService(room, roomData, name);
                if (newRoomData) {
                    console.log(name + ' added to room');
                    io.to(room).emit('room updated', newRoomData);
                }

                socket.on('disconnect', async () => {
                    const updatedRoomData = await getRoomService(room); 

                    console.log(name + ' disconnected of room');
                    const newRoomData = await removePlayerFromRoomService(room, updatedRoomData, name);
                    console.log('Exit player: ', name);
                    console.log('Room data: ', newRoomData);
                    io.to(room).emit('room updated', newRoomData);
                });
            }

        });

        socket.on('disconnect', async () => {
            console.log('user disconnected');
        });
    });

    return io;
};

export default setupSocket;