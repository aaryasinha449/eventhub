import { Router } from 'express';
import * as ctrl from '../controllers/registration.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.get('/me', requireAuth, ctrl.myRegistrations);
export default r;
