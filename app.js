import express from 'express';
import { createServer } from 'node:http';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import homeWebRoute from './routes/web/index.js'
import roomWebRoute from './routes/web/room.js'
import roomApiRoute from './routes/api/room.js'
import morgan from 'morgan';
import { redisClient } from './cache/config.js';
import setupSocket from './socket.js'

const app = express();
const server = createServer(app);
const io = setupSocket(server);

// Redis caché
redisClient.connect();
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes Web
app.use(homeWebRoute);
app.use(roomWebRoute);

// Router API
app.use(roomApiRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
