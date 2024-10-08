import createRouter from 'express-promise-router';
import { getHome } from '../../controllers/web.js';

const router = createRouter();

router.get('/', getHome);

export default router;