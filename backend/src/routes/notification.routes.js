import { Router } from 'express';
import * as ctrl from '../controllers/misc.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.get('/', requireAuth, ctrl.myNotifications);
r.post('/:id/read', requireAuth, ctrl.markNotificationRead);
export default r;
