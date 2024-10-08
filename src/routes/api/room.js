import createRouter from 'express-promise-router';
import { createRoom } from '../../controllers/room.js';

const router = createRouter();

router.post('/api/v1/room', createRoom);

export default router;