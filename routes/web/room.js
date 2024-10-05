import createRouter from 'express-promise-router';
import { getRoom } from '../../controllers/room.js';

const router = createRouter();

router.get('/room/:id', getRoom);

export default router;