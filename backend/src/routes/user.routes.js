import { Router } from 'express';
import * as ctrl from '../controllers/misc.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const r = Router();
r.get('/', requireAuth, requireRole('admin'), ctrl.listUsers);
r.post('/:id/role', requireAuth, requireRole('admin'), ctrl.setUserRole);
export default r;
