import { Server } from 'socket.io';
import registerRoomHandlers from './roomHandler.js';
import registerPlayerHandlers from './playerHandler.js';


const setupSocket = (server) => {
    const io = new Server(server);

    const onConnection = (socket) => {
        registerRoomHandlers(io, socket);
        registerPlayerHandlers(io, socket);
    };

    io.on('connection', onConnection);
    return io;
};

export default setupSocket;