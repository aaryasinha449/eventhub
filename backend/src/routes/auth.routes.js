import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const r = Router();
r.post('/signup', validate(ctrl.signupSchema), ctrl.signup);
r.post('/login', validate(ctrl.loginSchema), ctrl.login);
r.post('/forgot-password', validate(ctrl.forgotPasswordSchema), ctrl.forgotPassword);
r.get('/me', requireAuth, ctrl.me);
r.patch('/me', requireAuth, validate(ctrl.updateMeSchema), ctrl.updateMe);
export default r;
