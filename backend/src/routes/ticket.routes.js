import { Router } from 'express';
import * as ctrl from '../controllers/ticket.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const r = Router();
r.get('/me', requireAuth, ctrl.myTickets);
r.post('/verify', requireAuth, requireRole('admin'), validate(ctrl.verifySchema), ctrl.verifyHandler);
r.post('/check-in', requireAuth, requireRole('admin'), validate(ctrl.checkInSchema), ctrl.checkInHandler);
export default r;
