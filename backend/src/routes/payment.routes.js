import { Router } from 'express';
import * as ctrl from '../controllers/misc.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const r = Router();
r.get('/me', requireAuth, ctrl.myPayments);
r.get('/', requireAuth, requireRole('admin'), ctrl.allPayments);
export default r;
